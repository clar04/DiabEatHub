<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\services\SpoonacularService;
use App\services\DiabetesRuleService;
use Illuminate\Support\Facades\Log;

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
        $maxCarbs = (int) $request->query('maxCarbs', 30);
        $recipes = $this->spoonacular->diabetesRecipes($maxCarbs);
        $evaluated = array_map(function (array $recipe) {
            $raw = $recipe['raw'] ?? null;
            unset($recipe['raw']);
            $withRule = $this->rules->evaluate($recipe);
            $withRule['raw'] = $raw;

            $category = $withRule['analysis']['category']??'';
            $withRule['diabetes_friendly'] = ($category === 'diabetes_friendly');

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

        $data = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($id) {
            return $this->spoonacular->getRecipeDetail($id);
        });

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recipe detail from Spoonacular.'
            ], 502);
        }

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

        $evaluated = $this->rules->evaluate([
            'name'    => $data['title'] ?? "Recipe #{$id}",
            'carbs_g' => $carbs,
            'sugar_g' => $sugar,
            'source'  => 'spoonacular',
            'extendedIngredients'=> $data['extendedIngredients'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'item' => [
                'diabetes' => $evaluated,
                'raw' => $data,
            ],
        ]);
    }

    /**
     * GET /api/recipes/search?q=keyword
     * Cari resep umum dan tetap evaluasi skor diabetesnya
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $query = $request->query('q');

        // 1. Panggil service baru yang kita buat di atas
        $recipes = $this->spoonacular->searchRecipes($query);

        // 2. Evaluasi setiap resep dengan rules diabetes
        $evaluated = array_map(function (array $recipe) {
            $raw = $recipe['raw'] ?? null;
            unset($recipe['raw']);

            // Evaluasi nutrisi
            $withRule = $this->rules->evaluate($recipe);
            
            // Kembalikan data raw & set flag frontend
            $withRule['raw'] = $raw;
            
            // Perbaikan bug: Cek category 'diabetes_friendly'
            $category = $withRule['analysis']['category'] ?? '';
            $withRule['diabetes_friendly'] = ($category === 'diabetes_friendly');

            // Fallback waktu masak
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
    
public function generate(Request $request)
{
    $request->validate([
        'target' => 'required|numeric|min:1000|max:5000', // Target kalori
        'diet' => 'nullable|string' 
    ]);

    $target = (int) $request->input('target');
    $diet = $request->input('diet', '');

    $plan = $this->spoonacular->generateMealPlan($target, $diet);

    if (!$plan) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to generate meal plan from Spoonacular.'
        ], 502);
    }

    return response()->json([
        'success' => true,
        'data' => $plan
    ]);
}
}
