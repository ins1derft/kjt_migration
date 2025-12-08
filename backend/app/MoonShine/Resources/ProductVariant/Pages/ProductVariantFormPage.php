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
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Hidden;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Fields\Relationships\RelationRepeater;
use MoonShine\UI\Components\Layout\Box;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductAttribute\ProductAttributeResource;
use App\Models\ProductAttribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\Rule;
use MoonShine\Laravel\Http\Requests\Relations\RelationModelFieldRequest;
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
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('products/variants')
                    ->removable(),
                Number::make('Price', 'price')->step(0.01),
                Text::make('Label', 'label'),
                RelationRepeater::make('Attributes (string)', 'attributeValuesString', resource: \App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource::class)
                    ->fields([
                        ID::make(),
                        BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                            ->setColumn('product_attribute_id')
                            ->valuesQuery(fn (Builder $query) => $query->where('type', 'string'))
                            ->searchable()
                            ->required(),
                        Text::make('Type', 'attribute_type')
                            ->readonly()
                            ->default('string')
                            ->setValue('string'),
                        Text::make('Value', 'value_string'),
                        Number::make('Position', 'position')->default(0),
                    ])
                    ->creatable()
                    ->removable()
                    ->vertical(),
                RelationRepeater::make('Attributes (number)', 'attributeValuesNumber', resource: \App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource::class)
                    ->fields([
                        ID::make(),
                        BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                            ->setColumn('product_attribute_id')
                            ->valuesQuery(fn (Builder $query) => $query->where('type', 'number'))
                            ->searchable()
                            ->required(),
                        Text::make('Type', 'attribute_type')
                            ->readonly()
                            ->default('number')
                            ->setValue('number'),
                        Number::make('Value', 'value_number')->step(0.01),
                        Number::make('Position', 'position')->default(0),
                    ])
                    ->creatable()
                    ->removable()
                    ->vertical(),
                RelationRepeater::make('Attributes (boolean)', 'attributeValuesBoolean', resource: \App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource::class)
                    ->fields([
                        ID::make(),
                        BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                            ->setColumn('product_attribute_id')
                            ->valuesQuery(fn (Builder $query) => $query->where('type', 'boolean'))
                            ->searchable()
                            ->required(),
                        Text::make('Type', 'attribute_type')
                            ->readonly()
                            ->default('boolean')
                            ->setValue('boolean'),
                        Switcher::make('Value', 'value_boolean')->default(false),
                        Number::make('Position', 'position')->default(0),
                    ])
                    ->creatable()
                    ->removable()
                    ->vertical(),
                RelationRepeater::make('Attributes (json)', 'attributeValuesJson', resource: \App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource::class)
                    ->fields([
                        ID::make(),
                        BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                            ->setColumn('product_attribute_id')
                            ->valuesQuery(fn (Builder $query) => $query->where('type', 'json'))
                            ->searchable()
                            ->required(),
                        Text::make('Type', 'attribute_type')
                            ->readonly()
                            ->default('json')
                            ->setValue('json'),
                        Json::make('Value', 'value_json')
                            ->fields([
                                Text::make('Key', 'key')->required(),
                                Text::make('Value', 'value'),
                            ])
                            ->vertical()
                            ->creatable()
                            ->removable()
                            ->stopFilteringEmpty()
                            ->fromRaw(fn ($value) => is_array($value) ? $value : [])
                            ->nullable(),
                        Number::make('Position', 'position')->default(0),
                    ])
                    ->creatable()
                    ->removable()
                    ->vertical(),
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
            'attributeValuesString.*.product_attribute_id' => [
                'required',
                Rule::exists('product_attributes', 'id')->where(fn ($query) => $query->where('type', 'string')),
            ],
            'attributeValuesString.*.attribute_type' => ['nullable', Rule::in(ProductAttribute::TYPES)],
            'attributeValuesNumber.*.product_attribute_id' => [
                'required',
                Rule::exists('product_attributes', 'id')->where(fn ($query) => $query->where('type', 'number')),
            ],
            'attributeValuesNumber.*.attribute_type' => ['nullable', Rule::in(ProductAttribute::TYPES)],
            'attributeValuesBoolean.*.product_attribute_id' => [
                'required',
                Rule::exists('product_attributes', 'id')->where(fn ($query) => $query->where('type', 'boolean')),
            ],
            'attributeValuesBoolean.*.attribute_type' => ['nullable', Rule::in(ProductAttribute::TYPES)],
            'attributeValuesJson.*.product_attribute_id' => [
                'required',
                Rule::exists('product_attributes', 'id')->where(fn ($query) => $query->where('type', 'json')),
            ],
            'attributeValuesJson.*.attribute_type' => ['nullable', Rule::in(ProductAttribute::TYPES)],
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
