<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\FormField\FormFieldOptionResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends FormPage<FormFieldOptionResource>
 */
class FormFieldOptionFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Option', [
                ID::make(),
                Text::make('Value', 'value')->required(),
                Text::make('Label', 'label')->required(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'value' => ['required', 'string', 'max:255'],
            'label' => ['required', 'string', 'max:255'],
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
}
