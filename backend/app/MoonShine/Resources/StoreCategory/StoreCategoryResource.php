<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\StoreCategory;

use Illuminate\Database\Eloquent\Model;
use App\Models\StoreCategory;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryIndexPage;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryFormPage;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<StoreCategory, StoreCategoryIndexPage, StoreCategoryFormPage, StoreCategoryDetailPage>
 */
class StoreCategoryResource extends ModelResource
{
    protected string $model = StoreCategory::class;

    protected string $title = 'Store Categories';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            StoreCategoryIndexPage::class,
            StoreCategoryFormPage::class,
            StoreCategoryDetailPage::class,
        ];
    }
}
