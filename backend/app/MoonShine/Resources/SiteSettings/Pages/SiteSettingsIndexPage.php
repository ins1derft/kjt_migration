<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SiteSettings\Pages;

use App\MoonShine\Resources\SiteSettings\SiteSettingsResource;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;

/**
 * @extends IndexPage<SiteSettingsResource>
 */
class SiteSettingsIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Contact email', 'contact_email'),
            Text::make('Support email', 'support_email'),
        ];
    }
}
