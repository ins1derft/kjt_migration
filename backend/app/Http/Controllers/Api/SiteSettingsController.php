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
            return response()->json(null, 404);
        }

        return SiteSettingsResource::make($settings);
    }
}
