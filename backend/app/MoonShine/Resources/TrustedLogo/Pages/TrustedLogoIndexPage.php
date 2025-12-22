<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TrustedLogo\Pages;

use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

/**
 * @extends IndexPage<TrustedLogoResource>
 */
class TrustedLogoIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Image::make('Image', 'image')->disk('public')->dir('trusted-logos'),
            Text::make('Alt', 'alt'),
            Number::make('Position', 'position')->sortable(),
            Switcher::make('Active', 'is_active'),
        ];
    }
}
