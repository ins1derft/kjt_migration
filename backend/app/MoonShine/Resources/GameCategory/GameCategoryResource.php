<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\GameCategory;

use Illuminate\Database\Eloquent\Model;
use App\Models\GameCategory;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryIndexPage;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryFormPage;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<GameCategory, GameCategoryIndexPage, GameCategoryFormPage, GameCategoryDetailPage>
 */
class GameCategoryResource extends ModelResource
{
    protected string $model = GameCategory::class;

    protected string $title = 'Game Categories';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            GameCategoryIndexPage::class,
            GameCategoryFormPage::class,
            GameCategoryDetailPage::class,
        ];
    }
}
