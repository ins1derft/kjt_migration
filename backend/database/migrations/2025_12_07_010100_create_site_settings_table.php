<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        if (!DB::table('site_settings')->exists()) {
            $now = Carbon::now();

            DB::table('site_settings')->insert([
                'logo' => null,
                'header_phone' => '+18779010110',
                'header_whatsapp' => 'https://wa.me/15613828555',
                'contact_address_line1' => '150 NW 176th st., unit E,',
                'contact_address_line2' => 'Miami, FL, 33169',
                'contact_phone_main' => '(877) 901-0110',
                'contact_phone_main_label' => '(Toll free number)',
                'contact_phone_whatsapp' => '+1 (561) 382-8555',
                'contact_phone_whatsapp_label' => '(WhatsApp number for outside of US inquiries)',
                'contact_email' => 'info@kidsjumptech.com',
                'contact_hours' => 'Mon – Sat: 8 AM – 7 PM',
                'support_phone' => '+1 (786) 968-5878',
                'support_phone_label' => '(WhatsApp)',
                'support_email' => 'support@kidsjumptech.com',
                'social_links' => json_encode([], JSON_THROW_ON_ERROR),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};

