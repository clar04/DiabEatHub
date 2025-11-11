<?php   
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OpenFoodFactsService;
use App\Services\DiabetesRuleService;

class ProductController extends Controller
{
    public function __construct(
        protected OpenFoodFactsService $off,
        protected DiabetesRuleService $rules
    ) {}

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        $products = $this->off->search($request->q);

        $evaluated = array_map(fn($p) => $this->rules->evaluate($p), $products);

        return response()->json([
            'success' => true,
            'items' => $evaluated,
        ]);
    }
}
