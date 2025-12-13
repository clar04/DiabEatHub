<?php   
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\services\SpoonacularService; // Ubah import service
use App\services\DiabetesRuleService;

class ProductController extends Controller
{
    public function __construct(
        protected SpoonacularService $spoonacular, // Inject Spoonacular
        protected DiabetesRuleService $rules
    ) {}

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|max:100',
        ]);

        // Gunakan method searchProduct dari SpoonacularService
        // Ini akan mengembalikan 1 object produk lengkap (atau null)
        $product = $this->spoonacular->searchProduct($request->q);

        if (!$product) {
             return response()->json([
                'success' => false,
                'message' => 'Product not found in Spoonacular database.'
            ], 404);
        }

        // Evaluasi produk tersebut dengan rules diabetes baru
        $evaluated = $this->rules->evaluate($product);

        return response()->json([
            'success' => true,
            'data' => $evaluated, 
        ]);
    }
}