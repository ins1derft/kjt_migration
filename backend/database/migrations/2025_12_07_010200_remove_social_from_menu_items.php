<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('menu_items')
            ->where('slot', 'social')
            ->delete();
    }

    public function down(): void
    {
        // No-op: social slot is deprecated and not restored.
    }
};

