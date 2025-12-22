<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem\Pages;

use App\Models\Menu;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use Leeto\MoonShineTree\View\Components\TreeComponent;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\Support\Enums\FormMethod;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\ActionButton;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\UI\Components\Layout\Div;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Components\OffCanvas;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

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
        // Штатную панель фильтров не используем — рисуем собственный OffCanvas
        return [];
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

    protected function topRightButtons(): ListOf
    {
        $filters = (array) request()->input('filter', []);

        $buttons = parent::topRightButtons();

        return $buttons->add(
            ActionButton::make(fn () => __('moonshine::ui.filters'), '#')
                ->icon('funnel')
                ->inOffCanvas(
                    title: fn () => __('moonshine::ui.filters'),
                    content: fn () => Div::make([
                        FormBuilder::make(
                            action: request()->url(),
                            method: FormMethod::GET,
                            fields: [
                                Select::make('Menu', 'menu')
                                    ->wrapName('filter')
                                    ->options(
                                        Menu::query()
                                            ->orderBy('id')
                                            ->pluck('name', 'id')
                                            ->toArray()
                                    )
                                    ->searchable()
                                    ->nullable()
                                    ->setValue($filters['menu'] ?? null),

                                Select::make('Slot', 'slot')
                                    ->wrapName('filter')
                                    ->options([
                                        'primary' => 'Primary (main navigation or footer column)',
                                        'top_primary' => 'Header top bar (left)',
                                        'top_secondary' => 'Header top bar (right)',
                                        'footer' => 'Footer column',
                                    ])
                                    ->nullable()
                                    ->setValue($filters['slot'] ?? null),
                            ],
                        )
                            ->submit('Apply')
                            ->buttons([
                                ActionButton::make('Reset', url()->current())->secondary(),
                            ]),
                    ]),
                    name: 'menu-items-filters',
                    builder: null,
                    components: [],
                )
        );
    }

    protected function mainLayer(): array
    {
        return [
            ...$this->getQueryTagsButtons(),
            TreeComponent::make($this->getResource()),
        ];
    }
}
