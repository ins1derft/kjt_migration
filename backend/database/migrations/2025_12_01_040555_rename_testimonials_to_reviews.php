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
        if (Schema::hasTable('testimonials') && !Schema::hasTable('reviews')) {
            Schema::rename('testimonials', 'reviews');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('reviews') && !Schema::hasTable('testimonials')) {
            Schema::rename('reviews', 'testimonials');
        }
    }
};
