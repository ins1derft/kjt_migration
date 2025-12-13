<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sensory_room_bundles', function (Blueprint $table) {
            if (!Schema::hasColumn('sensory_room_bundles', 'custom_bundle_url')) {
                $table->string('custom_bundle_url')->nullable()->after('form_code');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sensory_room_bundles', function (Blueprint $table) {
            if (Schema::hasColumn('sensory_room_bundles', 'custom_bundle_url')) {
                $table->dropColumn('custom_bundle_url');
            }
        });
    }
};

