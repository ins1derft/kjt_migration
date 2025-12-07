<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('industry_product')) {
            Schema::drop('industry_product');
        }

        if (Schema::hasTable('industries')) {
            Schema::drop('industries');
        }
    }

    public function down(): void
    {
        Schema::create('industries', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('group');
            $table->timestamps();
        });

        Schema::create('industry_product', function (Blueprint $table) {
            $table->foreignId('industry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->primary(['industry_id', 'product_id']);
        });
    }
};
