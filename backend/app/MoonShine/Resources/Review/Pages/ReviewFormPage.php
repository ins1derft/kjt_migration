<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Review\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Review\ReviewResource;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;


/**
 * @extends FormPage<ReviewResource>
 */
class ReviewFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),
                Text::make('Name', 'name')->required()->unescape(),
                Date::make('Review date', 'review_date')->format('Y-m-d'),
                Number::make('Rating', 'rating')->min(1)->max(5)->default(5)->required(),
                TinyMce::make('Text', 'text')->required()->unescape(),
                Image::make('Avatar', 'avatar')
                    ->disk('public')
                    ->dir('reviews')
                    ->removable(),
                Text::make('Source URL', 'source_url'),
                Number::make('Position', 'position')->default(0),
                Switcher::make('Active', 'is_active')->default(true),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'review_date' => ['nullable', 'date'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'text' => ['required', 'string'],
            'avatar' => ['nullable', 'string'],
            'source_url' => ['nullable', 'url'],
            'position' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
