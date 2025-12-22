<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SiteSettings;

use App\Models\SiteSettings;
use App\MoonShine\Resources\SiteSettings\Pages\SiteSettingsDetailPage;
use App\MoonShine\Resources\SiteSettings\Pages\SiteSettingsFormPage;
use App\MoonShine\Resources\SiteSettings\Pages\SiteSettingsIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<SiteSettings, SiteSettingsIndexPage, SiteSettingsFormPage, SiteSettingsDetailPage>
 */
class SiteSettingsResource extends ModelResource
{
    protected string $model = SiteSettings::class;

    protected string $title = 'Site settings';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            SiteSettingsIndexPage::class,
            SiteSettingsFormPage::class,
            SiteSettingsDetailPage::class,
        ];
    }
}
