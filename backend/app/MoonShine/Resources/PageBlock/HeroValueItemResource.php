<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\HeroValueItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<HeroValueItem, HeroValueItemIndexPage, HeroValueItemFormPage, HeroValueItemDetailPage>
 */
class HeroValueItemResource extends ModelResource
{
    protected string $model = HeroValueItem::class;

    protected string $title = 'Hero value items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            HeroValueItemIndexPage::class,
            HeroValueItemFormPage::class,
            HeroValueItemDetailPage::class,
        ];
    }
}

class HeroValueItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Text::make('Description', 'description'),
            Number::make('Position', 'position'),
        ];
    }
}

class HeroValueItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Hero value item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(HeroValueItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/hero_values')
                    ->removable(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class HeroValueItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Text::make('Description', 'description'),
            Image::make('Icon', 'icon'),
            Number::make('Position', 'position'),
        ];
    }
}
