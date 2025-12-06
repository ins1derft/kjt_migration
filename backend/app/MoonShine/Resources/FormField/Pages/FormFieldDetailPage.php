<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Number;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use App\MoonShine\Resources\FormField\FormFieldResource;
use App\MoonShine\Resources\FormField\FormFieldOptionResource;

/**
 * @extends DetailPage<FormFieldResource>
 */
class FormFieldDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Name', 'name'),
            Text::make('Label', 'label'),
            Select::make('Type', 'type')->options([
                'text' => 'Text',
                'email' => 'Email',
                'phone' => 'Phone',
                'textarea' => 'Textarea',
                'select' => 'Select',
                'checkbox' => 'Checkbox',
            ]),
            Switcher::make('Required', 'required'),
            Text::make('Placeholder', 'placeholder'),
            Number::make('Position', 'position'),
            HasMany::make('Options', 'options', FormFieldOptionResource::class)->tabMode(),
        ];
    }
}
