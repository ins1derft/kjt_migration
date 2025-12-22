<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TeamMember\Pages;

use App\MoonShine\Resources\TeamMember\TeamMemberResource;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

/**
 * @extends FormPage<TeamMemberResource>
 */
class TeamMemberFormPage extends FormPage
{
    /**
     * @return iterable<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Photo', 'photo')
                ->disk('public')
                ->dir('team-members')
                ->removable()
                ->required(false),
            Text::make('Name', 'name')->required(),
            Slug::make('Slug', 'slug')->from('name')->unique(),
            Text::make('Role', 'role'),
            Text::make('Department', 'department'),
            TinyMce::make('Bio', 'bio')->unescape(),
            Number::make('Position', 'position')->default(0),
            Switcher::make('Active', 'is_active')->default(true),
        ];
    }
}
