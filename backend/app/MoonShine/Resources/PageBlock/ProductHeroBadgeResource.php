<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\ProductHeroBadge;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<ProductHeroBadge, ProductHeroBadgeIndexPage, ProductHeroBadgeFormPage, ProductHeroBadgeDetailPage>
 */
class ProductHeroBadgeResource extends ModelResource
{
    protected string $model = ProductHeroBadge::class;

    protected string $title = 'Product hero badges';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductHeroBadgeIndexPage::class,
            ProductHeroBadgeFormPage::class,
            ProductHeroBadgeDetailPage::class,
        ];
    }
}

class ProductHeroBadgeIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}

class ProductHeroBadgeFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Badge', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(ProductHeroBadge::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('products/badges')
                    ->removable(),
                Text::make('Label', 'label')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class ProductHeroBadgeDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Image', 'image'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}
