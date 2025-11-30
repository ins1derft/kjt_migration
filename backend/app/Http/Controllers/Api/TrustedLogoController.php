<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrustedLogoResource;
use App\Models\TrustedLogo;
use Illuminate\Http\Request;

class TrustedLogoController extends Controller
{
    public function index(Request $request)
    {
        $logos = TrustedLogo::query()
            ->where('is_active', true)
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        return TrustedLogoResource::collection($logos);
    }
}
