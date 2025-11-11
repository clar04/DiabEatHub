<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodCheck extends Model
{
        protected $fillable = ['query', 'result'];

    protected $casts = [
        'result' => 'array',
    ];
}
