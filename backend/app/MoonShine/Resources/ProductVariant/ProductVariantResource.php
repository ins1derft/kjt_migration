<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariant;

use App\Models\ProductVariant;
use App\MoonShine\Resources\ProductVariant\Pages\ProductVariantDetailPage;
use App\MoonShine\Resources\ProductVariant\Pages\ProductVariantFormPage;
use App\MoonShine\Resources\ProductVariant\Pages\ProductVariantIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<ProductVariant, ProductVariantIndexPage, ProductVariantFormPage, ProductVariantDetailPage>
 */
class ProductVariantResource extends ModelResource
{
    protected string $model = ProductVariant::class;

    protected string $title = 'Product Variants';

    protected array $with = ['product', 'attributeValues.attribute'];

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductVariantIndexPage::class,
            ProductVariantFormPage::class,
            ProductVariantDetailPage::class,
        ];
    }
}
