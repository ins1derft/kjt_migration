<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Review\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Switcher;
use App\MoonShine\Resources\Review\ReviewResource;


/**
 * @extends IndexPage<ReviewResource>
 */
class ReviewIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Name', 'name')->sortable(),
            Date::make('Review date', 'review_date')->format('Y-m-d')->sortable(),
            Number::make('Rating', 'rating')->sortable(),
            Number::make('Position', 'position')->sortable(),
            Switcher::make('Active', 'is_active'),
        ];
    }

    protected function filters(): iterable
    {
        return [
            Switcher::make('Active', 'is_active'),
        ];
    }
}
