<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\Form;
use App\Models\Page as PageModel;
use App\Models\PageBlocks\InteractiveShowcaseItem;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Hidden;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<InteractiveShowcaseItem, InteractiveShowcaseItemIndexPage, InteractiveShowcaseItemFormPage, InteractiveShowcaseItemDetailPage>
 */
class InteractiveShowcaseItemResource extends ModelResource
{
    protected string $model = InteractiveShowcaseItem::class;

    protected string $title = 'Interactive showcase items';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            InteractiveShowcaseItemIndexPage::class,
            InteractiveShowcaseItemFormPage::class,
            InteractiveShowcaseItemDetailPage::class,
        ];
    }
}

class InteractiveShowcaseItemIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Text::make('Product page', 'product_page_slug'),
            Number::make('Position', 'position'),
        ];
    }
}

class InteractiveShowcaseItemFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Interactive item', [
                ID::make(),
                Hidden::make('Block key', 'block_key')->default(InteractiveShowcaseItem::BLOCK_KEY),
                Hidden::make('Block index', 'block_index')->default(0),
                Text::make('Title', 'title')->required()->unescape(),
                Select::make('Product page', 'product_page_slug')
                    ->options(fn () => PageModel::query()
                        ->where('type', 'product_landing')
                        ->orderBy('title')
                        ->pluck('title', 'slug')
                        ->toArray())
                    ->nullable()
                    ->searchable()
                    ->hint('Page slug to open when title is clicked (product_landing)'),
                TinyMce::make('Description', 'description')->required()->unescape(),
                Text::make('Hashtag', 'hashtag')->unescape()->hint('# A game that encourages exploration'),
                HasMany::make('Features', 'features', formatted: null, resource: InteractiveShowcaseFeatureResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
                Text::make('CTA label', 'cta_label')->default('Order now')->unescape(),
                Text::make('CTA link', 'cta_href')->unescape()->hint('If formCode is empty we follow this link'),
                Select::make('Form', 'form_code')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->nullable()
                    ->searchable(),
                HasMany::make('Gallery', 'gallery', formatted: null, resource: InteractiveShowcaseGalleryItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
                Text::make('Video ID (YouTube)', 'video_id')->unescape(),
                Image::make('Video poster', 'video_poster')
                    ->disk('public')
                    ->dir('pages/interactive_showcase/posters')
                    ->removable(),
                Text::make('Video alt', 'video_alt')->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class InteractiveShowcaseItemDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Title', 'title'),
            Text::make('Product page', 'product_page_slug'),
            Text::make('Hashtag', 'hashtag'),
            Text::make('CTA label', 'cta_label'),
            Text::make('CTA link', 'cta_href'),
            Text::make('Form', 'form_code'),
            Text::make('Video ID', 'video_id'),
            Image::make('Video poster', 'video_poster'),
            Text::make('Video alt', 'video_alt'),
            Number::make('Position', 'position'),
        ];
    }
}
