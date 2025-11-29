<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\MenuItem;

use Illuminate\Database\Eloquent\Model;
use App\Models\MenuItem;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemIndexPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemFormPage;
use App\MoonShine\Resources\MenuItem\Pages\MenuItemDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<MenuItem, MenuItemIndexPage, MenuItemFormPage, MenuItemDetailPage>
 */
class MenuItemResource extends ModelResource
{
    protected string $model = MenuItem::class;

    protected string $title = 'Menu Items';
    
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
}
