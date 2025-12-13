<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SensoryRoomBundle\Pages;

use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\SensoryRoomBundle\SensoryRoomBundleResource;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use Throwable;

/**
 * @extends DetailPage<SensoryRoomBundleResource>
 */
class SensoryRoomBundleDetailPage extends DetailPage
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
            Textarea::make('Excerpt', 'excerpt')->unescape(),
            Text::make('Status', 'status'),
            Number::make('Position', 'position'),
            Text::make('Form code', 'form_code'),
            Text::make('Custom bundle URL', 'custom_bundle_url'),
            Json::make('Gallery', 'gallery')->fields([
                Image::make('Image', 'src')
                    ->disk('public')
                    ->dir('sensory-room/bundles/gallery'),
                Text::make('Alt', 'alt')->unescape(),
            ]),
            Json::make('Specs', 'specs')->fields([
                Text::make('Value', 'value')->unescape(),
            ]),
            Text::make('Block A title', 'block_a_title')->unescape(),
            Json::make('Block A items', 'block_a_items')->fields([
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('sensory-room/bundles/block-a/icons'),
                Textarea::make('Text', 'text')->unescape(),
            ]),
            Text::make('Block B title', 'block_b_title')->unescape(),
            Textarea::make('Block B text', 'block_b_text')->unescape(),
            BelongsToMany::make('Products', 'products', 'name', ProductResource::class),
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
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
