<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('name'); // Nama makanan
        $table->date('date'); // Tanggal makan (YYYY-MM-DD)
        $table->string('meal_type')->default('snack'); // breakfast, lunch, dinner, snack
        
        // Nutrisi yang disimpan
        $table->float('calories')->default(0);
        $table->float('protein')->default(0);
        $table->float('carbs')->default(0);
        $table->float('fat')->default(0);
        $table->float('sugar')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_logs');
    }
};
