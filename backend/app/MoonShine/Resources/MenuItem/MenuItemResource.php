<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem;

use App\Models\Menu;
use App\Models\MenuItem;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemDetailPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemFormPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemIndexPage;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Leeto\MoonShineTree\Resources\TreeResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends TreeResource<MenuItem, MenuItemIndexPage, MenuItemFormPage, MenuItemDetailPage>
 */
class MenuItemResource extends TreeResource
{
    protected string $model = MenuItem::class;

    protected string $title = 'Menu Items';

    protected string $column = 'label';

    protected string $sortColumn = 'position';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            MenuItemIndexPage::class,
            MenuItemFormPage::class,
            MenuItemDetailPage::class,
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

    protected function modifyQueryBuilder(Builder $builder): Builder
    {
        $filters = (array) request()->input('filter', []);

        // Build a fresh query to avoid implicit defaults (e.g. first menu)
        $builder = MenuItem::query();

        $menuId = null;

        if (request()->has('filter.menu')) {
            $menuId = $filters['menu'] ?? null;
        } elseif (request()->has('menu_id')) {
            $menuId = request()->integer('menu_id');
        } elseif (request()->has('menu')) {
            $menuId = request()->integer('menu');
        }

        if ($menuId !== null && $menuId !== '') {
            $menuId = (int) $menuId;

            if ($menuId > 0) {
                $builder->where('menu_id', $menuId);
            }
        }

        if (($filters['slot'] ?? '') !== '') {
            $builder->where('slot', $filters['slot']);
        }

        return $builder;
    }
}
