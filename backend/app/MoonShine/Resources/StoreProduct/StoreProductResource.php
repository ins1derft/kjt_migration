<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\StoreProduct;

use Illuminate\Database\Eloquent\Model;
use App\Models\StoreProduct;
use App\MoonShine\Resources\StoreProduct\Pages\StoreProductIndexPage;
use App\MoonShine\Resources\StoreProduct\Pages\StoreProductFormPage;
use App\MoonShine\Resources\StoreProduct\Pages\StoreProductDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<StoreProduct, StoreProductIndexPage, StoreProductFormPage, StoreProductDetailPage>
 */
class StoreProductResource extends ModelResource
{
    protected string $model = StoreProduct::class;

    protected string $title = 'Store Products';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            StoreProductIndexPage::class,
            StoreProductFormPage::class,
            StoreProductDetailPage::class,
        ];
    }
}
