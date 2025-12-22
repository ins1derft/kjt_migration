<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\StoreCategory;

use App\Models\StoreCategory;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryDetailPage;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryFormPage;
use App\MoonShine\Resources\StoreCategory\Pages\StoreCategoryIndexPage;
use Leeto\MoonShineTree\Resources\TreeResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends TreeResource<StoreCategory, StoreCategoryIndexPage, StoreCategoryFormPage, StoreCategoryDetailPage>
 */
class StoreCategoryResource extends TreeResource
{
    protected string $model = StoreCategory::class;

    protected string $title = 'Store Categories';

    protected string $column = 'name';

    protected string $sortColumn = 'position';

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

    public function treeKey(): ?string
    {
        return 'parent_id';
    }

    public function sortKey(): string
    {
        return $this->sortColumn;
    }
}
