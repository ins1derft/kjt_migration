<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait FormatsMediaUrls
{
    /**
     * Normalize stored media paths to a publicly reachable URL.
     * Returns the original value for already absolute URLs.
     */
    protected function mediaUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        if (Str::startsWith($path, '/storage/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
