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
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->jsonb('config')->nullable();
            $table->timestamps();
        });

        // Link products to forms once both tables exist
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'form_id')) {
                return;
            }

            $table->foreign('form_id')
                ->references('id')
                ->on('forms')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'form_id')) {
                $table->dropForeign(['form_id']);
            }
        });

        Schema::dropIfExists('forms');
    }
};
