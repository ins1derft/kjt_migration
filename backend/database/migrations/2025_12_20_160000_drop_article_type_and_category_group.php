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
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'type')) {
                $table->dropColumn('type');
            }
        });

        Schema::table('article_categories', function (Blueprint $table) {
            if (Schema::hasColumn('article_categories', 'group')) {
                $table->dropColumn('group');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'type')) {
                $table->string('type')->nullable();
            }
        });

        Schema::table('article_categories', function (Blueprint $table) {
            if (! Schema::hasColumn('article_categories', 'group')) {
                $table->string('group')->nullable();
            }
        });
    }
};
