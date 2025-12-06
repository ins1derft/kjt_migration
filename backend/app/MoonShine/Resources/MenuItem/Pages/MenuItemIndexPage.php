<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Select;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use App\MoonShine\Resources\Menu\MenuResource;
use MoonShine\Support\ListOf;
use Throwable;


/**
 * @extends IndexPage<MenuItemResource>
 */
class MenuItemIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Menu', 'menu.name'),
            Text::make('Label', 'label')->unescape(),
            Text::make('Parent', 'parent.label')->unescape(),
            Text::make('Slot', 'slot'),
            Text::make('URL', 'url'),
            Number::make('Position', 'position'),
            Switcher::make('Active', 'is_active'),
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @return list<FieldContract>
     */
    protected function filters(): iterable
    {
        return [
            BelongsTo::make('Menu', 'menu', 'name', MenuResource::class),
            Select::make('Slot', 'slot')
                ->options([
                    'primary' => 'Primary (main navigation or footer column)',
                    'top_primary' => 'Header top bar (left)',
                    'top_secondary' => 'Header top bar (right)',
                    'social' => 'Social link',
                    'footer' => 'Footer column',
                ]),
            BelongsTo::make('Parent item', 'parent', 'label', MenuItemResource::class)
                ->searchable()
                ->nullable()
                ->default(null),
        ];
    }

    /**
     * @return list<QueryTag>
     */
    protected function queryTags(): array
    {
        return [];
    }

    /**
     * @return list<Metric>
     */
    protected function metrics(): array
    {
        return [];
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyListComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
