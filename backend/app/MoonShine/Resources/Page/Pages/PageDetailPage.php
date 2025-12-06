<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Page\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Page\PageResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Image;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use App\MoonShine\Resources\PageBlock\HeroSlideResource;
use App\MoonShine\Resources\PageBlock\HeroValueItemResource;
use App\MoonShine\Resources\PageBlock\ProductNavItemResource;
use App\MoonShine\Resources\PageBlock\InteractiveShowcaseItemResource;
use App\MoonShine\Resources\PageBlock\ProductHeroBadgeResource;
use App\MoonShine\Resources\PageBlock\ProductSpecTabResource;
use App\MoonShine\Resources\PageBlock\FeatureGridItemResource;
use App\MoonShine\Resources\PageBlock\ProductCarouselFilterResource;
use App\MoonShine\Resources\PageBlock\GamesGalleryFilterResource;
use App\MoonShine\Resources\PageBlock\GamesGridFilterResource;
use App\MoonShine\Resources\PageBlock\NewsFilterResource;
use App\MoonShine\Resources\PageBlock\StatItemResource;
use App\MoonShine\Resources\PageBlock\FaqItemResource;
use App\MoonShine\Resources\PageBlock\ReviewItemResource;
use Throwable;


/**
 * @extends DetailPage<PageResource>
 */
class PageDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title')->unescape(),
            Text::make('Slug', 'slug'),
            Text::make('Type', 'type'),
            Text::make('Status', 'status'),
            Date::make('Published at', 'published_at')->format('Y-m-d H:i'),
            Text::make('SEO Title', 'seo_title')->unescape(),
            Textarea::make('SEO Description', 'seo_description')->unescape(),
            Text::make('Canonical URL', 'seo_canonical'),
            Image::make('OG Image', 'seo_og_image'),
            HasMany::make('Hero slides', 'heroSlides', HeroSlideResource::class)->tabMode(),
            HasMany::make('Hero values', 'heroValueItems', HeroValueItemResource::class)->tabMode(),
            HasMany::make('Product nav', 'productNavItems', ProductNavItemResource::class)->tabMode(),
            HasMany::make('Interactive showcase items', 'interactiveShowcaseItems', InteractiveShowcaseItemResource::class)->tabMode(),
            HasMany::make('Product hero badges', 'productHeroBadges', ProductHeroBadgeResource::class)->tabMode(),
            HasMany::make('Product spec tabs', 'productSpecTabs', ProductSpecTabResource::class)->tabMode(),
            HasMany::make('Feature grid items', 'featureGridItems', FeatureGridItemResource::class)->tabMode(),
            HasMany::make('Product carousel filters', 'productCarouselFilters', ProductCarouselFilterResource::class)->tabMode(),
            HasMany::make('Games gallery filters', 'gamesGalleryFilters', GamesGalleryFilterResource::class)->tabMode(),
            HasMany::make('Games grid filters', 'gamesGridFilters', GamesGridFilterResource::class)->tabMode(),
            HasMany::make('News filters', 'newsFilters', NewsFilterResource::class)->tabMode(),
            HasMany::make('Stat items', 'statItems', StatItemResource::class)->tabMode(),
            HasMany::make('FAQ items', 'faqItems', FaqItemResource::class)->tabMode(),
            HasMany::make('Review items', 'reviewItems', ReviewItemResource::class)->tabMode(),
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
