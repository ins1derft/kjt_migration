<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariantSpec;

use App\Models\ProductVariantSpec;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use App\MoonShine\Resources\ProductVariantSpec\Pages\ProductVariantSpecIndexPage;
use App\MoonShine\Resources\ProductVariantSpec\Pages\ProductVariantSpecFormPage;
use App\MoonShine\Resources\ProductVariantSpec\Pages\ProductVariantSpecDetailPage;

/**
 * @extends ModelResource<ProductVariantSpec, ProductVariantSpecIndexPage, ProductVariantSpecFormPage, ProductVariantSpecDetailPage>
 */
class ProductVariantSpecResource extends ModelResource
{
    protected string $model = ProductVariantSpec::class;

    protected string $title = 'Variant specs';

    protected bool $withOnIndex = false;

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductVariantSpecIndexPage::class,
            ProductVariantSpecFormPage::class,
            ProductVariantSpecDetailPage::class,
        ];
    }
}
