<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TrustedLogo\Pages;

use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

/**
 * @extends FormPage<TrustedLogoResource>
 */
class TrustedLogoFormPage extends FormPage
{
    /**
     * @return iterable<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Image::make('Image', 'image')
                ->disk('public')
                ->dir('trusted-logos')
                ->required(false)
                ->removable(),
            Text::make('Alt text', 'alt'),
            Number::make('Position', 'position')->default(0),
            Switcher::make('Active', 'is_active')->default(true),
        ];
    }
}
