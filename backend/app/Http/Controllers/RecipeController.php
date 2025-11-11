<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\SpoonacularService;
use App\Services\DiabetesRuleService;

class RecipeController extends Controller
{
    protected SpoonacularService $spoonacular;
    protected DiabetesRuleService $rules;

    public function __construct(SpoonacularService $spoonacular, DiabetesRuleService $rules)
    {
        $this->spoonacular = $spoonacular;
        $this->rules = $rules;
    }

    /**
     * GET /api/recipes/diabetes
     * ambil daftar resep dari Spoonacular, normalisasi, dan beri flag diabetes
     */
    public function diabetes(Request $request)
    {
        // bisa dikirim dari FE, default 30
        $maxCarbs = (int) $request->query('maxCarbs', 30);

        // ambil list resep ringkas dari service
        $recipes = $this->spoonacular->diabetesRecipes($maxCarbs);

        // jalankan rule ke tiap item
        $evaluated = array_map(function (array $recipe) {
            // simpan dulu data mentahnya
            $raw = $recipe['raw'] ?? null;
            unset($recipe['raw']);

            // jalankan rules diabetes ke versi ringkas
            $withRule = $this->rules->evaluate($recipe);

            // kembalikan raw supaya FE bisa tampilkan detail
            $withRule['raw'] = $raw;

            // kasih boolean biar FE gampang
            $withRule['diabetes_friendly'] = $withRule['diabetes_flag'] === 'OK';

            // kalau ready_in_min kosong tapi di raw ada, pakai yang raw
            if (empty($withRule['ready_in_min']) && isset($raw['readyInMinutes'])) {
                $withRule['ready_in_min'] = $raw['readyInMinutes'];
            }

            return $withRule;
        }, $recipes);

        return response()->json([
            'success' => true,
            'items' => $evaluated,
        ]);
    }

    /**
     * GET /api/recipes/{id}
     * ambil detail resep penuh dari Spoonacular + penilaian diabetes
     */
    public function show(int $id)
    {
        $cacheKey = "recipe_detail:{$id}";

        // simpan 30 menit supaya nggak nembak Spoonacular terus
        $data = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($id) {
            return $this->spoonacular->getRecipeDetail($id);
        });

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recipe detail from Spoonacular.'
            ], 502);
        }

        // ambil nutrisi karbo & gula kalau ada
        $carbs = 0;
        $sugar = 0;

        if (isset($data['nutrition']['nutrients']) && is_array($data['nutrition']['nutrients'])) {
            foreach ($data['nutrition']['nutrients'] as $nut) {
                if (($nut['name'] ?? null) === 'Carbohydrates') {
                    $carbs = $nut['amount'] ?? 0;
                }
                if (($nut['name'] ?? null) === 'Sugar') {
                    $sugar = $nut['amount'] ?? 0;
                }
            }
        }

        // jalankan rules ke versi ringkas
        $evaluated = $this->rules->evaluate([
            'name'    => $data['title'] ?? "Recipe #{$id}",
            'carbs_g' => $carbs,
            'sugar_g' => $sugar,
            'source'  => 'spoonacular',
        ]);

        return response()->json([
            'success' => true,
            'item' => [
                // ini buat badge / status
                'diabetes' => $evaluated,
                // ini resep full buat ditampilin FE
                'raw' => $data,
            ],
        ]);
    }
}
