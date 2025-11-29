<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;

class PageController extends Controller
{
    public function show(string $slug): PageResource
    {
        $page = Page::query()
            ->with([
                'product.variants',
                'product.games',
            ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return new PageResource($page);
    }
}
