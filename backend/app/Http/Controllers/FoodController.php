<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ApiNinjasNutritionService;
use App\Services\DiabetesRuleService;
use App\Models\FoodCheck;

class FoodController extends Controller
{
    public function __construct(
        protected ApiNinjasNutritionService $nutrition,
        protected DiabetesRuleService $rules
    ) {}

    public function check(Request $request)
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        $item = $this->nutrition->search($request->q);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch food data'
            ], 502);
        }

        $evaluated = $this->rules->evaluate($item);

        // save to db
        FoodCheck::create([
            'query' => $request->q,
            'result' => $evaluated,
        ]);

        return response()->json([
            'success' => true,
            'items' => [$evaluated],
        ]);
    }

    public function history()
    {
        $history = FoodCheck::latest()->take(10)->get();

        return response()->json([
            'success' => true,
            'items' => $history,
        ]);
    }
}
