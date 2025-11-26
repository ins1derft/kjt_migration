<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_category_store_product', function (Blueprint $table) {
            $table->foreignId('store_product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['store_product_id', 'store_category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_category_store_product');
    }
};
