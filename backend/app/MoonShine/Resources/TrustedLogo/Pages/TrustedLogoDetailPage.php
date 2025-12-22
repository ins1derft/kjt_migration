<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TrustedLogo\Pages;

use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

/**
 * @extends DetailPage<TrustedLogoResource>
 */
class TrustedLogoDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Image', 'image')->disk('public'),
            Text::make('Alt text', 'alt'),
            Number::make('Position', 'position'),
            Switcher::make('Active', 'is_active'),
        ];
    }
}
