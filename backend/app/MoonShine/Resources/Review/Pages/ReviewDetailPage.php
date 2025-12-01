<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Review\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Review\ReviewResource;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Image;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Components\Layout\Box;


/**
 * @extends DetailPage<ReviewResource>
 */
class ReviewDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),
                Text::make('Name', 'name'),
                Date::make('Review date', 'review_date')->format('Y-m-d'),
                Number::make('Rating', 'rating'),
                TinyMce::make('Text', 'text')->unescape(),
                Image::make('Avatar', 'avatar')
                    ->disk('public')
                    ->dir('reviews'),
                Text::make('Source URL', 'source_url'),
                Number::make('Position', 'position'),
                Switcher::make('Active', 'is_active'),
                Date::make('Created at', 'created_at')->format('Y-m-d H:i'),
                Date::make('Updated at', 'updated_at')->format('Y-m-d H:i'),
            ]),
        ];
    }
}
