<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->string('game_type')->nullable()->after('genre');
            $table->string('video_url')->nullable()->after('hero_image');
            $table->boolean('is_indexable')->default(true)->after('video_url');
        });

        Schema::create('game_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->unique(['game_id', 'product_id']);
        });

        Schema::table('store_products', function (Blueprint $table) {
            $table->jsonb('specs')->nullable()->after('is_available');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['game_type', 'video_url', 'is_indexable']);
        });

        Schema::dropIfExists('game_product');

        Schema::table('store_products', function (Blueprint $table) {
            $table->dropColumn('specs');
        });
    }
};
