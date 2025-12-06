<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\NewsFilter;
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
 * @extends ModelResource<NewsFilter, NewsFilterIndexPage, NewsFilterFormPage, NewsFilterDetailPage>
 */
class NewsFilterResource extends ModelResource
{
    protected string $model = NewsFilter::class;

    protected string $title = 'News filters';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            NewsFilterIndexPage::class,
            NewsFilterFormPage::class,
            NewsFilterDetailPage::class,
        ];
    }
}

class NewsFilterIndexPage extends IndexPage
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

class NewsFilterFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Filter', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(NewsFilter::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Select::make('Field', 'field')->options([
                    'types' => 'types',
                    'category_slugs' => 'category_slugs',
                ])->required(),
                Text::make('Value', 'value')->required(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class NewsFilterDetailPage extends DetailPage
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
