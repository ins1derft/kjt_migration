<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use App\MoonShine\Resources\Menu\MenuResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use Illuminate\Validation\Rule;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Number;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\UI\Components\Layout\Box;
use Throwable;


/**
 * @extends FormPage<MenuItemResource>
 */
class MenuItemFormPage extends FormPage
{
    private const SLOT_OPTIONS = [
        'primary' => 'Primary (main navigation or footer column)',
        'top_primary' => 'Header top bar (left)',
        'top_secondary' => 'Header top bar (right)',
        'social' => 'Social link',
        'footer' => 'Footer column',
    ];

    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        $menuId = request()->integer('menu_id')
            ?? $this->getResource()?->getItem()?->menu_id
            ?? request()->integer('resourceItem');

        return [
            Box::make('Menu item', [
                ID::make(),
                BelongsTo::make('Menu', 'menu', 'name', MenuResource::class)
                    ->required(),
                BelongsTo::make('Parent item', 'parent', 'label', MenuItemResource::class)
                    ->nullable()
                    ->valuesQuery(function ($query) use ($menuId) {
                        return $menuId ? $query->where('menu_id', $menuId) : $query;
                    }),
                Text::make('Label', 'label')->required(),
                Text::make('URL', 'url')->required(),
                Select::make('Slot', 'slot')
                    ->options(self::SLOT_OPTIONS)
                    ->default('primary'),
                Text::make('Icon code', 'icon')->hint('Optional. Use for social glyphs (f, ig, in, yt).'),
                Switcher::make('Open in new tab', 'opens_in_new_tab'),
                Switcher::make('Active', 'is_active')->default(true),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    protected function formButtons(): ListOf
    {
        return parent::formButtons();
    }

    protected function rules(DataWrapperContract $item): array
    {
        $currentItem = $this->getResource()?->getItem();
        $menuId = $item->get('menu_id') ?? $currentItem?->menu_id ?? request()->input('menu_id');

        $parentRules = ['nullable', 'integer'];

        if ($menuId) {
            $parentRules[] = Rule::exists('menu_items', 'id')->where(function ($query) use ($menuId) {
                return $query->where('menu_id', $menuId);
            });
        }

        return [
            'menu_id' => ['required', 'integer', Rule::exists('menus', 'id')],
            'parent_id' => $parentRules,
            'label' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:2048'],
            'slot' => ['required', 'string', Rule::in(array_keys(self::SLOT_OPTIONS))],
            'position' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @param  FormBuilder  $component
     *
     * @return FormBuilder
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
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
