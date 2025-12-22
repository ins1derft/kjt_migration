<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // No-op: data migration removed from migrations.

        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'specs')) {
                $table->dropColumn('specs');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'specs')) {
                $table->jsonb('specs')->nullable();
            }
        });

        // No-op: rollback does not backfill data.

        Schema::dropIfExists('product_variant_attribute_values');
        Schema::dropIfExists('product_attributes');
    }
};
