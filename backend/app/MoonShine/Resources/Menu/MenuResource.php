<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Menu;

use Illuminate\Database\Eloquent\Model;
use App\Models\Menu;
use App\MoonShine\Resources\Menu\Pages\MenuIndexPage;
use App\MoonShine\Resources\Menu\Pages\MenuFormPage;
use App\MoonShine\Resources\Menu\Pages\MenuDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Menu, MenuIndexPage, MenuFormPage, MenuDetailPage>
 */
class MenuResource extends ModelResource
{
    protected string $model = Menu::class;

    protected string $title = 'Menus';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            MenuIndexPage::class,
            MenuFormPage::class,
            MenuDetailPage::class,
        ];
    }
}
