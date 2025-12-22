<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SensoryRoomBundle;

use App\Models\SensoryRoomBundle;
use App\MoonShine\Resources\SensoryRoomBundle\Pages\SensoryRoomBundleDetailPage;
use App\MoonShine\Resources\SensoryRoomBundle\Pages\SensoryRoomBundleFormPage;
use App\MoonShine\Resources\SensoryRoomBundle\Pages\SensoryRoomBundleIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<SensoryRoomBundle, SensoryRoomBundleIndexPage, SensoryRoomBundleFormPage, SensoryRoomBundleDetailPage>
 */
class SensoryRoomBundleResource extends ModelResource
{
    protected string $model = SensoryRoomBundle::class;

    protected string $title = 'Sensory Room Bundles';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            SensoryRoomBundleIndexPage::class,
            SensoryRoomBundleFormPage::class,
            SensoryRoomBundleDetailPage::class,
        ];
    }
}
