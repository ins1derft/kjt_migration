<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement('ALTER TABLE menu_items ALTER COLUMN url DROP NOT NULL');
    }

    public function down(): void
    {
        DB::table('menu_items')
            ->whereNull('url')
            ->update(['url' => '']);

        DB::statement('ALTER TABLE menu_items ALTER COLUMN url SET NOT NULL');
    }
};
