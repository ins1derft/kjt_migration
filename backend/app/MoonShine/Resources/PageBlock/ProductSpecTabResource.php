<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\ProductSpecTab;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Image;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<ProductSpecTab, ProductSpecTabIndexPage, ProductSpecTabFormPage, ProductSpecTabDetailPage>
 */
class ProductSpecTabResource extends ModelResource
{
    protected string $model = ProductSpecTab::class;

    protected string $title = 'Product spec tabs';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductSpecTabIndexPage::class,
            ProductSpecTabFormPage::class,
            ProductSpecTabDetailPage::class,
        ];
    }
}

class ProductSpecTabIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Key', 'key'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}

class ProductSpecTabFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Spec tab', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(ProductSpecTab::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Tab key (unique)', 'key')->required()->placeholder('stationary'),
                Text::make('Tab label', 'label')->required()->unescape()->placeholder('Stationary'),
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('pages/specs')
                    ->removable(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class ProductSpecTabDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Key', 'key'),
            Text::make('Label', 'label'),
            Image::make('Image', 'image'),
            Text::make('Title', 'title'),
            Text::make('Description', 'description'),
            Number::make('Position', 'position'),
        ];
    }
}
