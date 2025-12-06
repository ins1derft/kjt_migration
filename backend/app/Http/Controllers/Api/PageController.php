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
                'product.form',
                'product.badges',
                'product.variants.specRows',
                'product.games',
                'heroSlides',
                'heroValueItems',
                'productNavItems',
                'interactiveShowcaseItems.features',
                'interactiveShowcaseItems.gallery',
                'productHeroBadges',
                'productSpecTabs',
                'featureGridItems',
                'productCarouselFilters',
                'gamesGalleryFilters',
                'gamesGridFilters',
                'newsFilters',
                'statItems',
                'faqItems',
                'reviewItems',
            ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return new PageResource($page);
    }
}
