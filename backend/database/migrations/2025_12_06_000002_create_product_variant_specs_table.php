<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_variant_specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained()->cascadeOnDelete();
            $table->string('key');
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        if (Schema::hasTable('product_variants')) {
            $variants = \Illuminate\Support\Facades\DB::table('product_variants')
                ->select('id', 'specs')
                ->whereNotNull('specs')
                ->get();

            foreach ($variants as $variant) {
                $specs = json_decode($variant->specs ?? '[]', true);
                if (!is_array($specs)) {
                    continue;
                }

                $index = 0;
                foreach ($specs as $key => $val) {
                    $type = 'string';
                    $out = $val;
                    if (is_bool($val)) {
                        $type = 'boolean';
                        $out = $val ? 'true' : 'false';
                    } elseif (is_numeric($val)) {
                        $type = 'number';
                        $out = (string) $val;
                    } elseif (is_array($val) || is_object($val)) {
                        $type = 'json';
                        $out = json_encode($val, JSON_UNESCAPED_UNICODE);
                    }

                    \Illuminate\Support\Facades\DB::table('product_variant_specs')->insert([
                        'product_variant_id' => $variant->id,
                        'key' => $key,
                        'value' => $out,
                        'type' => $type,
                        'position' => $index++,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_specs');
    }
};
