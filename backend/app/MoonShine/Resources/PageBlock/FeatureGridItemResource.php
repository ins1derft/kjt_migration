<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\FeatureGridItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<FeatureGridItem, FeatureGridItemIndexPage, FeatureGridItemFormPage, FeatureGridItemDetailPage>
 */
class FeatureGridItemResource extends ModelResource
{
    protected string $model = FeatureGridItem::class;

    protected string $title = 'Feature grid items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            FeatureGridItemIndexPage::class,
            FeatureGridItemFormPage::class,
            FeatureGridItemDetailPage::class,
        ];
    }
}

class FeatureGridItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Number::make('Position', 'position'),
        ];
    }
}

class FeatureGridItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Feature grid item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(FeatureGridItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/feature_grid/icons')
                    ->removable(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class FeatureGridItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Text::make('Description', 'description'),
            Image::make('Icon', 'icon'),
            Number::make('Position', 'position'),
        ];
    }
}
