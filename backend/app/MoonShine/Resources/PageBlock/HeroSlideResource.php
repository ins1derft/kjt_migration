<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\HeroSlide;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<HeroSlide, HeroSlideIndexPage, HeroSlideFormPage, HeroSlideDetailPage>
 */
class HeroSlideResource extends ModelResource
{
    protected string $model = HeroSlide::class;

    protected string $title = 'Hero slides';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            HeroSlideIndexPage::class,
            HeroSlideFormPage::class,
            HeroSlideDetailPage::class,
        ];
    }
}

class HeroSlideIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Video ID', 'video_id'),
            Text::make('Alt', 'alt'),
            Number::make('Position', 'position'),
        ];
    }
}

class HeroSlideFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Hero slide', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(HeroSlide::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Video ID (YouTube)', 'video_id')->required(),
                Text::make('Alt text', 'alt')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class HeroSlideDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Video ID', 'video_id'),
            Text::make('Alt', 'alt'),
            Number::make('Position', 'position'),
        ];
    }
}
