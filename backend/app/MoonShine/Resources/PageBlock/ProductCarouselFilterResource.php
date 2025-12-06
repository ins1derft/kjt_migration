<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\ProductCarouselFilter;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<ProductCarouselFilter, ProductCarouselFilterIndexPage, ProductCarouselFilterFormPage, ProductCarouselFilterDetailPage>
 */
class ProductCarouselFilterResource extends ModelResource
{
    protected string $model = ProductCarouselFilter::class;

    protected string $title = 'Product carousel filters';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductCarouselFilterIndexPage::class,
            ProductCarouselFilterFormPage::class,
            ProductCarouselFilterDetailPage::class,
        ];
    }
}

class ProductCarouselFilterIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Field', 'field'),
            Text::make('Value', 'value'),
            Number::make('Position', 'position'),
        ];
    }
}

class ProductCarouselFilterFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Filter', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(ProductCarouselFilter::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Select::make('Field', 'field')->options([
                    'slug' => 'slug',
                ])->required(),
                Text::make('Value', 'value')->required(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class ProductCarouselFilterDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Field', 'field'),
            Text::make('Value', 'value'),
            Number::make('Position', 'position'),
        ];
    }
}
