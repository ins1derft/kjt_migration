<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem;

use App\Models\MenuItem;
use App\Models\Menu;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemIndexPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemFormPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemDetailPage;

use Leeto\MoonShineTree\Resources\TreeResource;
use MoonShine\Contracts\Core\PageContract;
use Illuminate\Contracts\Database\Eloquent\Builder;

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

        $menuId = request()->integer('menu_id')
            ?? request()->integer('menu')
            ?? (isset($filters['menu']) ? (int) $filters['menu'] : null);

        if (! $menuId) {
            $menuId = Menu::query()->orderBy('id')->value('id');
        }

        if ($menuId) {
            $builder->where('menu_id', $menuId);
        }

        if (($filters['slot'] ?? '') !== '') {
            $builder->where('slot', $filters['slot']);
        }

        return $builder;
    }
}
