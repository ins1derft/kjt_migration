<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariantSpec\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\ProductVariantSpec\ProductVariantSpecResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Components\Layout\Box;
use Throwable;

/**
 * @extends FormPage<ProductVariantSpecResource>
 */
class ProductVariantSpecFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Spec', [
                ID::make(),
                Text::make('Key', 'key')->required(),
                Text::make('Value', 'value'),
                Select::make('Type', 'type')->options([
                    'string' => 'String',
                    'number' => 'Number',
                    'boolean' => 'Boolean',
                    'json' => 'JSON',
                ])->default('string'),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'key' => ['required', 'string', 'max:255'],
            'value' => ['nullable', 'string'],
            'type' => ['required', 'string', 'in:string,number,boolean,json'],
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
