<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SpoonacularService; // Ubah import service
use App\Services\DiabetesRuleService;
use App\Models\FoodCheck;

class FoodController extends Controller
{
    public function __construct(
        protected SpoonacularService $spoonacular, // Inject Spoonacular
        protected DiabetesRuleService $rules
    ) {}

    public function check(Request $request)
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        // Panggil method searchIngredient dari SpoonacularService
        $item = $this->spoonacular->searchIngredient($request->q);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Food data not found in Spoonacular database.'
            ], 404);
        }

        $evaluated = $this->rules->evaluate($item);

        // Save to DB
        // Pastikan model FoodCheck memiliki 'casts' => ['result' => 'array'] jika ingin otomatis json_encode
        FoodCheck::create([
            'query' => $request->q,
            'result' => $evaluated,
        ]);

        return response()->json([
            'success' => true,
            'data' => $evaluated, // Saya ubah key 'items' jadi 'data' karena isinya cuma 1 object
        ]);
    }

    public function history()
    {
        $history = FoodCheck::latest()->take(10)->get();

        return response()->json([
            'success' => true,
            'data' => $history, // Konsisten pakai key 'data'
        ]);
    }
}