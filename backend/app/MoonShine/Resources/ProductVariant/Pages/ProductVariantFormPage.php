<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariant\Pages;

use Closure;
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
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Fields\Relationships\RelationRepeater;
use MoonShine\UI\Components\Layout\Box;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductAttribute\ProductAttributeResource;
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
                RelationRepeater::make('Attributes', 'attributeValues', resource: \App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource::class)
                    ->fields([
                        ID::make(),
                        BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                            ->searchable()
                            ->asyncSearch()
                            ->required(),
                        Text::make('Type', 'attribute_type')
                            ->readonly()
                            ->default('string'),
                        Number::make('Value', 'value_number')
                            ->step(0.01)
                            ->canSee($this->attributeTypeIs('number')),
                        Switcher::make('Value', 'value_boolean')
                            ->default(false)
                            ->canSee($this->attributeTypeIs('boolean')),
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
                            ->nullable()
                            ->canSee($this->attributeTypeIs('json')),
                        Text::make('Value', 'value_string')
                            ->canSee($this->attributeTypeIs('string')),
                        Number::make('Position', 'position')->default(0),
                    ])
                    ->creatable()
                    ->removable()
                    ->vertical(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }

    private function attributeTypeIs(string $expected): Closure
    {
        return function (FieldContract $field) use ($expected): bool {
            return $this->resolveAttributeType($field) === $expected;
        };
    }

    private function resolveAttributeType(FieldContract $field): string
    {
        $data = $field->getData()?->toArray() ?? [];

        $type = data_get($data, 'attribute_type')
            ?? data_get($data, 'attribute.type');

        return $type ?: 'string';
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
            'attributeValues.*.product_attribute_id' => ['required', 'exists:product_attributes,id'],
            'attributeValues.*.attribute_type' => ['nullable', 'in:string,number,boolean,json'],
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
