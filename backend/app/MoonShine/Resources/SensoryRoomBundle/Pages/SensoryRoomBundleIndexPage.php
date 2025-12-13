<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SensoryRoomBundle\Pages;

use App\MoonShine\Resources\SensoryRoomBundle\SensoryRoomBundleResource;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Text;

/**
 * @extends IndexPage<SensoryRoomBundleResource>
 */
class SensoryRoomBundleIndexPage extends IndexPage
{
    /**
     * @return iterable<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Title', 'title')->sortable()->unescape(),
            Text::make('Slug', 'slug')->sortable(),
            Text::make('Status', 'status')->sortable(),
            Text::make('Form code', 'form_code'),
            Text::make('Custom bundle URL', 'custom_bundle_url'),
            Number::make('Position', 'position')->sortable(),
        ];
    }
}
