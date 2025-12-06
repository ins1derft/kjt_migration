<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\InteractiveShowcaseGalleryItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<InteractiveShowcaseGalleryItem, InteractiveShowcaseGalleryItemIndexPage, InteractiveShowcaseGalleryItemFormPage, InteractiveShowcaseGalleryItemDetailPage>
 */
class InteractiveShowcaseGalleryItemResource extends ModelResource
{
    protected string $model = InteractiveShowcaseGalleryItem::class;

    protected string $title = 'Showcase gallery';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            InteractiveShowcaseGalleryItemIndexPage::class,
            InteractiveShowcaseGalleryItemFormPage::class,
            InteractiveShowcaseGalleryItemDetailPage::class,
        ];
    }
}

class InteractiveShowcaseGalleryItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Alt', 'alt'),
            Number::make('Position', 'position'),
        ];
    }
}

class InteractiveShowcaseGalleryItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Gallery item', [
                ID::make(),
                Image::make('Image', 'src')
                    ->disk('public')
                    ->dir('pages/interactive_showcase/gallery')
                    ->removable(),
                Text::make('Alt text', 'alt')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class InteractiveShowcaseGalleryItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Image', 'src'),
            Text::make('Alt', 'alt'),
            Number::make('Position', 'position'),
        ];
    }
}
