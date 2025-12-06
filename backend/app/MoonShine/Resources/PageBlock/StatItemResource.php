<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\StatItem;
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
 * @extends ModelResource<StatItem, StatItemIndexPage, StatItemFormPage, StatItemDetailPage>
 */
class StatItemResource extends ModelResource
{
    protected string $model = StatItem::class;

    protected string $title = 'Stats items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            StatItemIndexPage::class,
            StatItemFormPage::class,
            StatItemDetailPage::class,
        ];
    }
}

class StatItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Value', 'value'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}

class StatItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Stat item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(StatItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Value', 'value')->unescape(),
                Text::make('Label', 'label')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class StatItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Value', 'value'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}
