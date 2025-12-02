<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SpoonacularService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.spoonacular.com';

    public function __construct()
    {
        $this->apiKey = config('services.spoonacular.key', '');
    }

    // --- HELPER: Wrapper Request untuk DRY Code ---
    protected function get(string $endpoint, array $params = [])
    {
        if (empty($this->apiKey)) return null;
        
        $params['apiKey'] = $this->apiKey;
        $response = Http::get("{$this->baseUrl}/{$endpoint}", $params);

        if ($response->failed()) return null;
        return $response->json();
    }

    // --- HELPER: Normalisasi Nutrisi Spoonacular ke Format Standard Kita ---
    protected function extractNutrients(array $nutritionObj): array
    {
        $nutrients = $nutritionObj['nutrients'] ?? [];
        
        // Map nama nutrisi dari Spoonacular ke key database/logic kita
        $map = [
            'Calories' => 'calories',
            'Carbohydrates' => 'carbs_g',
            'Sugar' => 'sugar_g',
            'Fiber' => 'fiber_g',
            'Fat' => 'fat_g',
            'Saturated Fat' => 'saturated_fat_g',
            'Sodium' => 'sodium_mg',
            'Protein' => 'protein_g'
        ];

        // Default 0 semua
        $result = [];
        foreach ($map as $key => $val) {
            $result[$val] = 0;
        }

        // Isi nilai jika ada
        foreach ($nutrients as $n) {
            $name = $n['name'] ?? '';
            if (isset($map[$name])) {
                $result[$map[$name]] = $n['amount'];
            }
        }
        return $result;
    }

    // --- 1. FOOD / INGREDIENTS (Pengganti ApiNinjas) ---
    // Mencari bahan mentah (apel, nasi goreng, ayam)
    public function searchIngredient(string $query): ?array
    {
        // Step 1: Cari ID makanan dulu
        $search = $this->get('food/ingredients/search', [
            'query' => $query,
            'number' => 1 // Ambil yang paling relevan
        ]);

        if (empty($search['results'])) return null;

        $item = $search['results'][0];
        $id = $item['id'];
        $name = $item['name'];

        // Step 2: Ambil detail nutrisi (amount 1 serving standard = 100g atau 1 piece)
        // Cache 24 jam biar hemat API call
        $detail = Cache::remember("ingr_{$id}", now()->addHours(24), function () use ($id) {
            return $this->get("food/ingredients/{$id}/information", ['amount' => 1]);
        });

        if (!$detail) return null;

        $nutrition = $this->extractNutrients($detail['nutrition'] ?? []);
        
        return array_merge([
            'name' => $name,
            'image' => "https://spoonacular.com/cdn/ingredients_100x100/" . ($item['image'] ?? ''),
            'source' => 'spoonacular_ingredient'
        ], $nutrition);
    }

    // --- 2. PRODUCTS / PACKAGED (Pengganti OpenFoodFacts) ---
    // Mencari produk bermerek (Oreo, Indomie, Coca Cola)
    public function searchProduct(string $query): ?array
    {
        // Step 1: Cari Product ID
        $search = $this->get('food/products/search', [
            'query' => $query,
            'number' => 1
        ]);

        if (empty($search['products'])) return null;

        $product = $search['products'][0];
        $id = $product['id'];

        // Step 2: Ambil detail nutrisi produk
        $detail = Cache::remember("prod_{$id}", now()->addHours(24), function () use ($id) {
            return $this->get("food/products/{$id}");
        });

        if (!$detail) return null;

        $nutrition = $this->extractNutrients($detail['nutrition'] ?? []);

        return array_merge([
            'name' => $detail['title'] ?? $query,
            'image' => $detail['image'] ?? '',
            'brand' => $detail['brand'] ?? '',
            'source' => 'spoonacular_product'
        ], $nutrition);
    }

    // --- 3. RECIPES (Fitur Lama tapi Diperbarui Outputnya) ---
    public function diabetesRecipes(int $maxCarbs = 30): array
    {
        $data = $this->get('recipes/complexSearch', [
            'addRecipeNutrition' => true,
            'maxCarbs' => $maxCarbs,
            'number' => 10,
        ]);

        $results = $data['results'] ?? [];

        return array_map(function ($item) {
            $nutrition = $this->extractNutrients($item['nutrition'] ?? []);
            
            return array_merge([
                'id' => $item['id'], // Penting buat link ke detail
                'name' => $item['title'],
                'image' => $item['image'],
                'ready_in_min' => $item['readyInMinutes'] ?? 0,
                'source' => 'spoonacular_recipe'
            ], $nutrition);
        }, $results);
    }

    public function getRecipeDetail(int $id): ?array
    {
        $data = $this->get("recipes/{$id}/information", ['includeNutrition' => true]);
        
        if (!$data) return null;

        $nutrition = $this->extractNutrients($data['nutrition'] ?? []);
        
        return array_merge([
            'name' => $data['title'],
            'image' => $data['image'] ?? '',
            'ready_in_min' => $data['readyInMinutes'] ?? 0,
            'extendedIngredients' => $data['extendedIngredients'] ?? [],
            'instructions' => $data['instructions'] ?? '',
            'source' => 'spoonacular_recipe'
        ], $nutrition);
    }
}