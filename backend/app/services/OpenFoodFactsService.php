<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenFoodFactsService
{
    public function search(string $query): array
    {
        $res = Http::get('https://world.openfoodfacts.org/cgi/search.pl', [
            'search_terms' => $query,
            'search_simple' => 1,
            'json' => 1,
            'page_size' => 5,
        ]);

        if ($res->failed()) {
            return [];
        }

        $products = $res->json()['products'] ?? [];

        return array_map(function ($p) {
            return [
                'name' => $p['product_name'] ?? 'Unknown product',
                'serving' => '100 g',
                'carbs_g' => $p['nutriments']['carbohydrates_100g'] ?? 0,
                'sugar_g' => $p['nutriments']['sugars_100g'] ?? 0,
                'ingredients' => $p['ingredients_text'] ?? null,
                'source' => 'openfoodfacts',
            ];
        }, $products);
    }
}
