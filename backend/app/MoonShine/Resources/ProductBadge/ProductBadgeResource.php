<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductBadge;

use App\Models\ProductBadge;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use App\MoonShine\Resources\ProductBadge\Pages\ProductBadgeIndexPage;
use App\MoonShine\Resources\ProductBadge\Pages\ProductBadgeFormPage;
use App\MoonShine\Resources\ProductBadge\Pages\ProductBadgeDetailPage;

/**
 * @extends ModelResource<ProductBadge, ProductBadgeIndexPage, ProductBadgeFormPage, ProductBadgeDetailPage>
 */
class ProductBadgeResource extends ModelResource
{
    protected string $model = ProductBadge::class;

    protected string $title = 'Product badges';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductBadgeIndexPage::class,
            ProductBadgeFormPage::class,
            ProductBadgeDetailPage::class,
        ];
    }
}
