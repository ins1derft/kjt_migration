<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\GameCategory;

use App\Models\GameCategory;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryDetailPage;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryFormPage;
use App\MoonShine\Resources\GameCategory\Pages\GameCategoryIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

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
