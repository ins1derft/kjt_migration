<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariant\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\UI\Components\Layout\Box;
use App\MoonShine\Resources\Product\ProductResource;
use Throwable;

/**
 * @extends FormPage<ProductVariantResource>
 */
class ProductVariantFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),
                BelongsTo::make('Product', 'product', 'name', ProductResource::class)->required(),
                Text::make('Name', 'name')->required(),
                Text::make('SKU', 'sku'),
                Number::make('Price', 'price')->step(0.01),
                Text::make('Label', 'label'),
                Json::make('Specs', 'specs_table')
                    ->fields([
                        Text::make('Key', 'key')->required(),
                        Text::make('Value', 'value'),
                        Select::make('Type', 'type')->options([
                            'string' => 'String',
                            'number' => 'Number',
                            'boolean' => 'Boolean',
                            'json' => 'JSON',
                        ])->default('string'),
                    ])
                    ->creatable()
                    ->removable()
                    ->fromRaw(function ($value) {
                        if (!is_array($value)) {
                            return $value;
                        }

                        return collect($value)->map(function ($val, $key) {
                            $type = 'string';
                            $outVal = $val;

                            if (is_bool($val)) {
                                $type = 'boolean';
                                $outVal = $val ? 'true' : 'false';
                            } elseif (is_numeric($val)) {
                                $type = 'number';
                                $outVal = (string) $val;
                            } elseif (is_array($val) || is_object($val)) {
                                $type = 'json';
                                $outVal = json_encode($val, JSON_UNESCAPED_UNICODE);
                            }

                            return [
                                'key' => $key,
                                'value' => $outVal,
                                'type' => $type,
                            ];
                        })->values()->toArray();
                    })
                    ->nullable(),
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
        return [
            'product_id' => ['required', 'exists:products,id'],
            'name' => ['required', 'string', 'max:255'],
            'specs_table' => ['nullable', 'array'],
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
