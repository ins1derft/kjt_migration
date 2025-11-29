<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Detail\DetailBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Number;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use MoonShine\Support\ListOf;
use Throwable;


/**
 * @extends DetailPage<MenuItemResource>
 */
class MenuItemDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Menu', 'menu.name'),
            Text::make('Parent', 'parent.label'),
            Text::make('Label', 'label'),
            Text::make('URL', 'url'),
            Text::make('Slot', 'slot'),
            Text::make('Icon', 'icon'),
            Switcher::make('Open in new tab', 'opens_in_new_tab'),
            Switcher::make('Active', 'is_active'),
            Number::make('Position', 'position'),
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  DetailBuilder  $component
     *
     * @return DetailBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
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
