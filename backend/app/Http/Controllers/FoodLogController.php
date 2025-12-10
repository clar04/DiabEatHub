<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FoodLog;
use Illuminate\Support\Facades\Auth;

class FoodLogController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['date' => 'required|date']);
        
        $logs = FoodLog::where('user_id', Auth::id())
                    ->where('date', $request->date)
                    ->orderBy('created_at', 'desc')
                    ->get();

        $summary = [
            'calories' => $logs->sum('calories'),
            'protein' => $logs->sum('protein'),
            'carbs' => $logs->sum('carbs'),
            'fat' => $logs->sum('fat'),
            'sugar' => $logs->sum('sugar'),
        ];

        return response()->json([
            'success' => true,
            'data' => $logs,
            'summary' => $summary
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'meal_type' => 'nullable|string',
            'calories' => 'required|numeric',
            'protein' => 'nullable|numeric',
            'carbs' => 'nullable|numeric',
            'fat' => 'nullable|numeric',
            'sugar' => 'nullable|numeric',
        ]);

        $log = Auth::user()->foodLogs()->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Food added to diary.',
            'data' => $log
        ], 201);
    }

    public function destroy($id)
    {
        $log = FoodLog::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$log) {
            return response()->json(['success' => false, 'message' => 'Item not found.'], 404);
        }

        $log->delete();

        return response()->json(['success' => true, 'message' => 'Item removed.']);
    }
}
