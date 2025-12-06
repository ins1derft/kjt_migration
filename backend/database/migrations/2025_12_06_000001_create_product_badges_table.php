<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('image')->nullable();
            $table->string('label')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        // migrate existing JSON badges into the new table
        if (Schema::hasTable('products')) {
            $products = \Illuminate\Support\Facades\DB::table('products')
                ->select('id', 'badges')
                ->whereNotNull('badges')
                ->get();

            foreach ($products as $product) {
                $badges = json_decode($product->badges ?? '[]', true);
                if (!is_array($badges)) {
                    continue;
                }

                foreach (array_values($badges) as $index => $badge) {
                    \Illuminate\Support\Facades\DB::table('product_badges')->insert([
                        'product_id' => $product->id,
                        'image' => $badge['image'] ?? null,
                        'label' => $badge['label'] ?? null,
                        'position' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_badges');
    }
};
