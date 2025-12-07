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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();

            $table->string('header_phone')->nullable();
            $table->string('header_whatsapp')->nullable();

            $table->string('contact_address_line1')->nullable();
            $table->string('contact_address_line2')->nullable();
            $table->string('contact_phone_main')->nullable();
            $table->string('contact_phone_main_label')->nullable();
            $table->string('contact_phone_whatsapp')->nullable();
            $table->string('contact_phone_whatsapp_label')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_hours')->nullable();

            $table->string('support_phone')->nullable();
            $table->string('support_phone_label')->nullable();
            $table->string('support_email')->nullable();

            $table->json('social_links')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
