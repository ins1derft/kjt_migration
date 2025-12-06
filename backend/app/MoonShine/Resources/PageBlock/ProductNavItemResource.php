<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\ProductNavItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<ProductNavItem, ProductNavItemIndexPage, ProductNavItemFormPage, ProductNavItemDetailPage>
 */
class ProductNavItemResource extends ModelResource
{
    protected string $model = ProductNavItem::class;

    protected string $title = 'Product nav items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductNavItemIndexPage::class,
            ProductNavItemFormPage::class,
            ProductNavItemDetailPage::class,
        ];
    }
}

class ProductNavItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Label', 'label'),
            Text::make('Anchor', 'anchor'),
            Number::make('Position', 'position'),
        ];
    }
}

class ProductNavItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Product nav item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(ProductNavItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Label', 'label')->required()->unescape(),
                Text::make('Anchor id', 'anchor')->required()->hint('Target block id without #, e.g. description')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class ProductNavItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Label', 'label'),
            Text::make('Anchor', 'anchor'),
            Number::make('Position', 'position'),
        ];
    }
}
