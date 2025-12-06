<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\ReviewItem;
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
 * @extends ModelResource<ReviewItem, ReviewItemIndexPage, ReviewItemFormPage, ReviewItemDetailPage>
 */
class ReviewItemResource extends ModelResource
{
    protected string $model = ReviewItem::class;

    protected string $title = 'Review items (page)';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ReviewItemIndexPage::class,
            ReviewItemFormPage::class,
            ReviewItemDetailPage::class,
        ];
    }
}

class ReviewItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Name', 'name'),
            Number::make('Rating', 'rating'),
            Number::make('Position', 'position'),
        ];
    }
}

class ReviewItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Review', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(ReviewItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Name', 'name')->unescape(),
                Text::make('Date', 'date')->unescape(),
                Number::make('Rating', 'rating')->min(1)->max(5)->default(5),
                TinyMce::make('Text', 'text')->unescape(),
                Image::make('Avatar', 'avatar')
                    ->disk('public')
                    ->dir('reviews')
                    ->removable(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class ReviewItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Name', 'name'),
            Text::make('Date', 'date'),
            Number::make('Rating', 'rating'),
            Text::make('Text', 'text'),
            Image::make('Avatar', 'avatar'),
            Number::make('Position', 'position'),
        ];
    }
}
