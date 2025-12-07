<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingsResource;
use App\Models\SiteSettings;

class SiteSettingsController extends Controller
{
    public function show()
    {
        $settings = SiteSettings::query()->first();

        if (!$settings) {
            $settings = new SiteSettings([
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
                'social_links' => [],
            ]);
        }

        return SiteSettingsResource::make($settings);
    }
}

