<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TeamMember\Pages;

use App\MoonShine\Resources\TeamMember\TeamMemberResource;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;

/**
 * @extends DetailPage<TeamMemberResource>
 */
class TeamMemberDetailPage extends DetailPage
{
    /**
     * @return iterable<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Photo', 'photo')->disk('public')->dir('team-members'),
            Text::make('Name', 'name'),
            Text::make('Slug', 'slug'),
            Text::make('Role', 'role'),
            Text::make('Department', 'department'),
            Textarea::make('Bio', 'bio')->readonly(),
            Number::make('Position', 'position'),
            Switcher::make('Active', 'is_active'),
        ];
    }
}
