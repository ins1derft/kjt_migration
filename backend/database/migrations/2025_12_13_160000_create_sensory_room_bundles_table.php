<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensory_room_bundles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->jsonb('gallery')->nullable();
            $table->jsonb('specs')->nullable();
            $table->string('form_code')->nullable();
            $table->string('block_a_title')->nullable();
            $table->jsonb('block_a_items')->nullable();
            $table->string('block_b_title')->nullable();
            $table->longText('block_b_text')->nullable();
            $table->string('status')->default('draft')->index();
            $table->integer('position')->default(0)->index();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('seo_canonical')->nullable();
            $table->string('seo_og_image')->nullable();
            $table->timestamps();
        });

        Schema::create('product_sensory_room_bundle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sensory_room_bundle_id')
                ->constrained('sensory_room_bundles')
                ->cascadeOnDelete();
            $table->unique(['product_id', 'sensory_room_bundle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sensory_room_bundle');
        Schema::dropIfExists('sensory_room_bundles');
    }
};
