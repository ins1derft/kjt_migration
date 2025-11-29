<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('posts')) {
            Schema::drop('posts');
        }
    }

    public function down(): void
    {
        // Re-create minimal structure in case of rollback
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }
};
