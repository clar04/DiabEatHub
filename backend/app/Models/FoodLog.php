<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'date',
        'meal_type',
        'calories',
        'protein',
        'carbs',
        'fat',
        'sugar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
