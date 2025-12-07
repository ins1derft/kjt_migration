<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('article_categories', function (Blueprint $table) {
            $table->unsignedInteger('position')->default(0)->after('parent_id');
        });

        Schema::table('store_categories', function (Blueprint $table) {
            $table->unsignedInteger('position')->default(0)->after('parent_id');
        });

        $this->seedPositions('article_categories');
        $this->seedPositions('store_categories');
    }

    public function down(): void
    {
        Schema::table('article_categories', function (Blueprint $table) {
            $table->dropColumn('position');
        });

        Schema::table('store_categories', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }

    private function seedPositions(string $table): void
    {
        $rows = DB::table($table)
            ->orderBy('parent_id')
            ->orderBy('id')
            ->get()
            ->groupBy('parent_id');

        foreach ($rows as $parentId => $group) {
            foreach ($group->values() as $index => $row) {
                DB::table($table)
                    ->where('id', $row->id)
                    ->update(['position' => $index]);
            }
        }
    }
};
