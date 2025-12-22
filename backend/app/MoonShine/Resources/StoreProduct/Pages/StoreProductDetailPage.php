<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\StoreProduct\Pages;

use App\MoonShine\Resources\StoreCategory\StoreCategoryResource;
use App\MoonShine\Resources\StoreProduct\StoreProductResource;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use Throwable;

/**
 * @extends DetailPage<StoreProductResource>
 */
class StoreProductDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Name', 'name')->unescape(),
            Text::make('Slug', 'slug'),
            Textarea::make('Excerpt', 'excerpt')->unescape(),
            Textarea::make('Description', 'description')->unescape(),
            Image::make('Image', 'image'),
            Number::make('Price', 'price'),
            Switcher::make('Available', 'is_available'),
            BelongsToMany::make('Categories', 'categories', 'name', StoreCategoryResource::class),
            Text::make('SEO Title', 'seo_title')->unescape(),
            Textarea::make('SEO Description', 'seo_description')->unescape(),
            Text::make('Canonical URL', 'seo_canonical'),
            Image::make('OG Image', 'seo_og_image'),
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
