<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::table('pages')
            ->whereNull('type')
            ->orWhereNot('type', 'product_landing')
            ->update(['type' => 'static']);
    }

    public function down(): void
    {
        // No-op: previous types are removed permanently
    }
};
