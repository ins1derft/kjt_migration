<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\FaqItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<FaqItem, FaqItemIndexPage, FaqItemFormPage, FaqItemDetailPage>
 */
class FaqItemResource extends ModelResource
{
    protected string $model = FaqItem::class;

    protected string $title = 'FAQ items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            FaqItemIndexPage::class,
            FaqItemFormPage::class,
            FaqItemDetailPage::class,
        ];
    }
}

class FaqItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Question', 'question'),
            Number::make('Position', 'position'),
        ];
    }
}

class FaqItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('FAQ item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(FaqItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Question', 'question')->unescape(),
                TinyMce::make('Answer', 'answer')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class FaqItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Question', 'question'),
            Text::make('Answer', 'answer'),
            Number::make('Position', 'position'),
        ];
    }
}
