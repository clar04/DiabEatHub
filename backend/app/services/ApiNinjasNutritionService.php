<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ApiNinjasNutritionService
{
    public function search(string $query): ?array
    {
        $res = Http::withHeaders([
            'X-Api-Key' => config('services.api_ninjas.key'),
        ])->get('https://api.api-ninjas.com/v1/nutrition', [
            'query' => $query,
        ]);

        if ($res->failed()) {
            return null;
        }

        $data = $res->json()[0] ?? null;

        if (!$data) {
            return null;
        }

        $carbs = $data['carbohydrates_total_g'] ?? 0;
        $sugar = $data['sugar_g'] ?? 0;

        return [
            'name'    => $data['name'] ?? $query,
            'serving' => isset($data['serving_size_g']) ? $data['serving_size_g'].' g' : null,
            'carbs_g' => $data['carbohydrates_total_g'] ?? 0,
            'sugar_g' => $data['sugar_g'] ?? 0,
            'source'  => 'api-ninjas',
        ];
    }
}
