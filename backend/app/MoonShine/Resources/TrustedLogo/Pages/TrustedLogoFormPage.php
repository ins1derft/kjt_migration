<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TrustedLogo\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;

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
