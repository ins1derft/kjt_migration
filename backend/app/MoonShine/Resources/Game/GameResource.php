<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Game;

use Illuminate\Database\Eloquent\Model;
use App\Models\Game;
use App\MoonShine\Resources\Game\Pages\GameIndexPage;
use App\MoonShine\Resources\Game\Pages\GameFormPage;
use App\MoonShine\Resources\Game\Pages\GameDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Game, GameIndexPage, GameFormPage, GameDetailPage>
 */
class GameResource extends ModelResource
{
    protected string $model = Game::class;

    protected string $title = 'Games';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            GameIndexPage::class,
            GameFormPage::class,
            GameDetailPage::class,
        ];
    }
}
