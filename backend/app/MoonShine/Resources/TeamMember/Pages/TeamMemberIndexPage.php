<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TeamMember\Pages;

use App\MoonShine\Resources\TeamMember\TeamMemberResource;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;

/**
 * @extends IndexPage<TeamMemberResource>
 */
class TeamMemberIndexPage extends IndexPage
{
    /**
     * @return iterable<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Image::make('Photo', 'photo')->disk('public')->dir('team-members')->removable(),
            Text::make('Name', 'name')->sortable(),
            Text::make('Role', 'role'),
            Text::make('Department', 'department'),
            Number::make('Position', 'position')->sortable(),
            Switcher::make('Active', 'is_active')->readonly(),
        ];
    }
}
