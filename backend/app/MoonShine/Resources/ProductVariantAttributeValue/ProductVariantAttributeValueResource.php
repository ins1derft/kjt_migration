<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariantAttributeValue;

use App\Models\ProductVariantAttributeValue;
use App\MoonShine\Resources\ProductVariantAttributeValue\Pages\ProductVariantAttributeValueDetailPage;
use App\MoonShine\Resources\ProductVariantAttributeValue\Pages\ProductVariantAttributeValueFormPage;
use App\MoonShine\Resources\ProductVariantAttributeValue\Pages\ProductVariantAttributeValueIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<ProductVariantAttributeValue, ProductVariantAttributeValueIndexPage, ProductVariantAttributeValueFormPage, ProductVariantAttributeValueDetailPage>
 */
class ProductVariantAttributeValueResource extends ModelResource
{
    protected string $model = ProductVariantAttributeValue::class;

    protected string $title = 'Variant Attribute Values';

    protected array $with = ['attribute', 'variant'];

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductVariantAttributeValueIndexPage::class,
            ProductVariantAttributeValueFormPage::class,
            ProductVariantAttributeValueDetailPage::class,
        ];
    }
}
