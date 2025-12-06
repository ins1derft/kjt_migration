<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\GamesGridFilter;
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
 * @extends ModelResource<GamesGridFilter, GamesGridFilterIndexPage, GamesGridFilterFormPage, GamesGridFilterDetailPage>
 */
class GamesGridFilterResource extends ModelResource
{
    protected string $model = GamesGridFilter::class;

    protected string $title = 'Games grid filters';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            GamesGridFilterIndexPage::class,
            GamesGridFilterFormPage::class,
            GamesGridFilterDetailPage::class,
        ];
    }
}

class GamesGridFilterIndexPage extends IndexPage
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

class GamesGridFilterFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Filter', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(GamesGridFilter::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Select::make('Field', 'field')->options([
                    'slug' => 'slug',
                    'title' => 'title',
                    'genre' => 'genre',
                    'target_age' => 'target_age',
                    'game_type' => 'game_type',
                    'video_id' => 'video_id',
                    'is_indexable' => 'is_indexable',
                ])->required(),
                Text::make('Value', 'value')->required(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class GamesGridFilterDetailPage extends DetailPage
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
