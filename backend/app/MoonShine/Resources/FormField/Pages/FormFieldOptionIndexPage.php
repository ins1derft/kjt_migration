<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use App\MoonShine\Resources\FormField\FormFieldOptionResource;

/**
 * @extends IndexPage<FormFieldOptionResource>
 */
class FormFieldOptionIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Value', 'value'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}
