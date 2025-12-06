<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\FormField\FormFieldResource;
use App\MoonShine\Resources\FormField\FormFieldOptionResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Number;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use MoonShine\UI\Components\Layout\Box;
use Throwable;

/**
 * @extends FormPage<FormFieldResource>
 */
class FormFieldFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Field', [
                ID::make(),
                Text::make('Name', 'name')->required(),
                Text::make('Label', 'label')->required()->unescape(),
                Select::make('Type', 'type')->options([
                    'text' => 'Text',
                    'email' => 'Email',
                    'phone' => 'Phone',
                    'textarea' => 'Textarea',
                    'select' => 'Select',
                    'checkbox' => 'Checkbox',
                ])->required(),
                Switcher::make('Required', 'required')->default(true),
                Text::make('Placeholder', 'placeholder')->nullable(),
                Number::make('Position', 'position')->default(0),
                HasMany::make('Options', 'options', FormFieldOptionResource::class)
                    ->tabMode()
                    ->nullable()
                    ->sortable()
                    ->hideOnIndex()
                    ->hint('Use for select/checkbox types'),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:text,email,phone,textarea,select,checkbox'],
            'required' => ['nullable', 'boolean'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'integer'],
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

    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
    {
        return $component;
    }

    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
