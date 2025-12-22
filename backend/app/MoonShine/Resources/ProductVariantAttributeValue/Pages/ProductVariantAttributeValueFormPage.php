<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariantAttributeValue\Pages;

use App\MoonShine\Resources\ProductAttribute\ProductAttributeResource;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use App\MoonShine\Resources\ProductVariantAttributeValue\ProductVariantAttributeValueResource;
use Illuminate\Validation\Rule;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends FormPage<ProductVariantAttributeValueResource>
 */
class ProductVariantAttributeValueFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),
                BelongsTo::make('Variant', 'variant', 'name', ProductVariantResource::class)
                    ->setColumn('product_variant_id')
                    ->required(),
                BelongsTo::make('Attribute', 'attribute', 'name', ProductAttributeResource::class)
                    ->setColumn('product_attribute_id')
                    ->required(),
                Text::make('Attribute type', 'attribute_type')->readonly(),
                Text::make('Value', 'value'),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'product_attribute_id' => ['required', 'exists:product_attributes,id'],
            'attribute_type' => ['nullable', Rule::in(['string', 'number', 'boolean', 'json'])],
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

    /**
     * @param  FormBuilder  $component
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
