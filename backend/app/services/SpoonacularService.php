<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SpoonacularService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.spoonacular.com';

    public function __construct()
    {
        $this->apiKey = config('services.spoonacular.key', '');
    }

    public function diabetesRecipes(int $maxCarbs = 30): array
    {
        if (empty($this->apiKey)) {
            return [];
        }

        $response = Http::get("{$this->baseUrl}/recipes/complexSearch", [
            'apiKey' => $this->apiKey,
            'addRecipeNutrition' => true,
            'maxCarbs' => $maxCarbs,
            'number' => 10, // ambil 10 dulu
        ]);

        if ($response->failed()) {
            return [];
        }

        $results = $response->json('results') ?? [];

        return array_map(function (array $item) {
            $carbs = 0;
            $sugar = 0;

            foreach ($item['nutrition']['nutrients'] ?? [] as $nut) {
                if (($nut['name'] ?? null) === 'Carbohydrates') {
                    $carbs = $nut['amount'] ?? 0;
                }
                if (($nut['name'] ?? null) === 'Sugar') {
                    $sugar = $nut['amount'] ?? 0;
                }
            }

            return [
                // versi ringkas
                'name'         => $item['title'] ?? 'Unknown recipe',
                'ready_in_min' => $item['readyInMinutes'] ?? null,
                'carbs_g'      => $carbs,
                'sugar_g'      => $sugar,
                'source'       => 'spoonacular',

                'raw'          => $item,
            ];
        }, $results);
    }


    public function getRecipeDetail(int $id): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        $response = Http::get("{$this->baseUrl}/recipes/{$id}/information", [
            'apiKey' => $this->apiKey,
            'includeNutrition' => true,
        ]);

        if ($response->failed()) {
            return null;
        }

        return $response->json();
    }
}
