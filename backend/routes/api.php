<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ProductController;

Route::get('/food/check', [FoodController::class, 'check']);
Route::get('/recipes/diabetes', [RecipeController::class, 'diabetes']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);
Route::get('/products/search', [ProductController::class, 'search']);
Route::get('/history/food', [FoodController::class, 'history']); 
