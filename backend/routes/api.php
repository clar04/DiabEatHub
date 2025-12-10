<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FoodLogController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/food/check',     [FoodController::class, 'check']);
Route::get('/products/search',[ProductController::class, 'search']);
Route::get('/history/food',   [FoodController::class, 'history']);

Route::get('/recipes/diabetes', [RecipeController::class, 'diabetes']);
Route::get('/recipes/search',   [RecipeController::class, 'search']);
Route::get('/recipes/generate', [RecipeController::class, 'generate']); 
Route::get('/recipes/{id}',     [RecipeController::class, 'show']);    

Route::middleware('auth:sanctum')->group(function () {
    // Auth User
    Route::get('/me',            [AuthController::class, 'me']);
    Route::post('/logout',       [AuthController::class, 'logout']);

    // Food Diary (Harus login karena pakai Auth::id)
    Route::get('/diary',         [FoodLogController::class, 'index']);
    Route::post('/diary',        [FoodLogController::class, 'store']);
    Route::delete('/diary/{id}', [FoodLogController::class, 'destroy']);
});