<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Page\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use Illuminate\Validation\Rule;
use App\MoonShine\Resources\Page\PageResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\UI\Fields\Select;
use App\Models\Product;
use App\Models\Page as PageModel;
use App\Models\Review;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\File;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Layouts\Fields\Layouts;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Fields\Number;
use App\Models\Game;
use App\Models\Form;
use App\Models\Article;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Components\FlexibleRender;
use MoonShine\Layouts\Fields\Layout as LayoutBlock;
use Closure;
use Throwable;
use MoonShine\UI\Fields\Color;


/**
 * @extends FormPage<PageResource>
 */
class PageFormPage extends FormPage
{
    /**
     * Reusable padding override field (one string with classes).
     *
     * @return list<FieldContract>
     */
    private function paddingFields(): array
    {
        return [
            Text::make('Padding', 'padding')
                ->nullable()
                ->hint('Tailwind/utility classes, e.g. "pt-[80px] pb-[60px]". Leave empty to use block defaults.'),
        ];
    }

    /**
     * Reusable background color picker (overrides default bg class).
     *
     * @return list<FieldContract>
     */
    private function backgroundColorFields(): array
    {
        return [
            Color::make('Background color', 'backgroundColor')
                ->nullable()
                ->hint('Optional HEX (e.g., #ffffff). Leave empty to keep default background.'),
        ];
    }

    /**
     * Extra heading controls for every block in layouts.
     *
     * @return list<ComponentContract>
     */
    private function layoutClipboardHeadingComponents(string $layoutName): array
    {
        $html = sprintf(
            '<span class="btn btn-secondary btn-xs _layouts-copy-btn" ' .
            'title="Copy this block to clipboard" data-layout-name="%s" ' .
            'x-on:click.stop.prevent="window.KjtLayoutsClipboard && window.KjtLayoutsClipboard.copy($event)">' .
            '<span class="icon-wrapper text-current mr-1">' .
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">' .
            '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5h7.5m-7.5 3h7.5m-7.5 3h4.5M5.25 6.75A2.25 2.25 0 0 1 7.5 4.5h7.5A2.25 2.25 0 0 1 17.25 6.75v10.5A2.25 2.25 0 0 1 15 19.5H7.5a2.25 2.25 0 0 1-2.25-2.25V6.75z" />' .
            '</svg></span>Copy</span>',
            e($layoutName),
        );

        return [FlexibleRender::make($html)];
    }

    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        $layouts = Layouts::make('Blocks', 'blocks')
            ->onApply($this->applyLayoutsWithDotSupport());

        $layouts
            ->addLayout('Hero', 'hero', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                Json::make('Slides', 'slides')->fields([
                    Image::make('Image', 'image')
                        ->disk('public')
                        ->dir('pages/hero')
                        ->removable()
                        ->hint('Заполните это поле, если нужен статичный слайд без видео'),
                    Text::make('Video ID (YouTube)', 'videoId')
                        ->nullable()
                        ->hint('Оставьте пустым для изображений или укажите ID ролика для видео-слайда'),
                    Text::make('Alt text', 'alt')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Page header', 'page_header', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->required()->unescape(),
            ])
            ->addLayout('Hero + Values', 'hero_values', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                Text::make('Subtitle', 'subtitle')->unescape(),
                TinyMce::make('Text', 'text')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Live Demo')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('mailto:info@kidsjumptech.com?subject=Live%20Demo'),
                Select::make('Columns', 'columns')->options([2 => '2', 3 => '3', 4 => '4'])->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                    Image::make('Icon', 'icon')
                        ->disk('public')
                        ->dir('pages/hero_values')
                        ->removable(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Product description', 'product_description', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Product nav', 'product_nav', [
                Json::make('Items', 'items')->fields([
                    Text::make('Label', 'label')->required()->unescape(),
                    Text::make('Anchor id', 'anchor')
                        ->required()
                        ->placeholder('description')
                        ->hint('Target block id without #, e.g. description, specs, faq'),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Our approach', 'our_approach', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape()->default('Our Approach'),
                TinyMce::make('Description', 'description')->unescape(),
                Json::make('Orbit icons', 'items')
                    ->fields([
                        Image::make('Icon', 'icon')
                            ->disk('public')
                            ->dir('pages/our_approach/icons')
                            ->removable(),
                        Text::make('Title', 'title')->required()->unescape(),
                    ])
                    ->vertical()
                    ->creatable()
                    ->removable()
                    ->hint('Max 5 items'),
            ])
            ->addLayout('Interactive showcase', 'interactive_header', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                Select::make('Default form', 'defaultFormCode')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->nullable()
                    ->searchable()
                    ->hint('If set, CTAs without formCode will open this form code'),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->required()->unescape(),
                    Select::make('Product page', 'productPageSlug')
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
                    Json::make('Features', 'features')->fields([
                        Image::make('Icon 1', 'icon1')
                            ->disk('public')
                            ->dir('pages/interactive_showcase/icons')
                            ->removable(),
                        Image::make('Icon 2', 'icon2')
                            ->disk('public')
                            ->dir('pages/interactive_showcase/icons')
                            ->removable(),
                        Image::make('Icon 3', 'icon3')
                            ->disk('public')
                            ->dir('pages/interactive_showcase/icons')
                            ->removable(),
                        Text::make('Label', 'label')->required()->unescape(),
                    ])->vertical()->creatable()->removable(),
                    Text::make('CTA label', 'ctaLabel')->default('Order now')->unescape(),
                    Select::make('Form', 'formCode')
                        ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                        ->nullable()
                        ->searchable(),
                    TinyMce::make('Form description', 'formDescription')
                        ->unescape()
                        ->nullable()
                        ->hint('Optional text shown under the modal title when this item opens a form'),
                    Json::make('Gallery', 'gallery')->fields([
                        Image::make('Image', 'src')
                            ->disk('public')
                            ->dir('pages/interactive_showcase/gallery')
                            ->removable(),
                        Text::make('Alt', 'alt')->unescape(),
                    ])->vertical()->creatable()->removable(),
                    Text::make('Video ID (YouTube)', 'videoId')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Interactive equipment', 'interactive_equipment', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape()->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->required()->unescape(),
                    TinyMce::make('Description', 'description')->unescape()->nullable(),
                    TinyMce::make('Body', 'body')->unescape()->nullable(),
                    Json::make('Tabs', 'tabs')->fields([
                        Text::make('Label', 'label')->required()->unescape(),
                        Image::make('Icon', 'icon')
                            ->disk('public')
                            ->dir('pages/interactive_equipment/tabs')
                            ->removable(),
                        TinyMce::make('Content', 'content')->unescape()->nullable(),
                    ])->vertical()->creatable()->removable(),
                    Text::make('Video ID (YouTube)', 'videoId')->unescape(),
                    TinyMce::make('Video caption', 'videoCaption')->unescape()->nullable(),
                    Text::make('Primary CTA label', 'primaryCtaLabel')
                        ->default('Live Demo')
                        ->unescape(),
                    Select::make('Primary CTA form', 'primaryCtaFormCode')
                        ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                        ->nullable()
                        ->searchable(),
                    Text::make('Primary CTA modal title', 'primaryCtaFormTitle')->unescape()->nullable(),
                    Text::make('Secondary CTA label', 'secondaryCtaLabel')
                        ->default('Get a Quote')
                        ->unescape(),
                    Select::make('Secondary CTA form', 'secondaryCtaFormCode')
                        ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                        ->nullable()
                        ->searchable(),
                    Text::make('Secondary CTA modal title', 'secondaryCtaFormTitle')->unescape()->nullable(),
                    Text::make('Specialists title', 'specialistsTitle')
                        ->default('Used by all sorts of specialists')
                        ->unescape()
                        ->nullable(),
                    Json::make('Specialists (left)', 'specialistsLeft')->fields([
                        Text::make('Item', 'text')->required()->unescape(),
                    ])->vertical()->creatable()->removable(),
                    Json::make('Specialists (right)', 'specialistsRight')->fields([
                        Text::make('Item', 'text')->required()->unescape(),
                    ])->vertical()->creatable()->removable(),
                    Text::make('Reviews title', 'reviewsTitle')
                        ->unescape()
                        ->nullable(),
                    Json::make('Reviews', 'reviews')->fields([
                        Text::make('Name', 'name')->required()->unescape(),
                        Text::make('Meta', 'meta')
                            ->hint('e.g. role, company, or “3 months ago”')
                            ->unescape()
                            ->nullable(),
                        TinyMce::make('Text', 'text')->unescape()->nullable(),
                        Text::make('Video ID (YouTube)', 'videoId')->unescape()->nullable(),
                    ])->vertical()->creatable()->removable(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Software equipment', 'software_equipment', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape()->nullable(),
                Text::make('Label text', 'label.text')->unescape()->nullable(),
                Color::make('Label background', 'label.backgroundColor')->nullable(),
                Color::make('Label text color', 'label.textColor')->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->required()->unescape(),
                    Image::make('Icon', 'icon')
                        ->disk('public')
                        ->dir('pages/software_equipment/icons')
                        ->removable()
                        ->nullable(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Product hero', 'product_hero', [
                ...$this->backgroundColorFields(),
                Switcher::make('Use product data', 'useProductData')
                    ->hint('If enabled, fields fall back to the linked Product of the page'),
                Select::make('Badge variant', 'badgeVariant')->options([
                    'image' => 'Images in a row',
                    'card' => 'Cards with labels',
                ])->default('image'),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Slogan', 'slogan')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Number::make('Rating', 'rating')->step(0.1)->min(0)->max(5),
                Text::make('Review count label', 'reviewCount')->unescape()->hint('e.g. 120+ reviews'),
                Json::make('Badges', 'badges')->fields([
                    Image::make('Image', 'image')
                        ->disk('public')
                        ->dir('products/badges')
                        ->removable(),
                    Text::make('Label', 'label')->unescape(),
                ])->vertical()->creatable()->removable(),
                Text::make('CTA label', 'ctaLabel')->default('Get a Quote')->unescape(),
                Select::make('Form', 'formCode')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->nullable()
                    ->searchable()
                    ->hint('If set, overrides product.form.code'),
                Text::make('Form title', 'formTitle')->unescape()->hint('Optional modal title override'),
            ])
            ->addLayout('Product specs', 'product_specs', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Json::make('Tabs', 'tabs')->fields([
                    Text::make('Tab key (unique)', 'key')
                        ->required()
                        ->placeholder('stationary')
                        ->hint('Slug-like identifier (latin chars, no spaces); used internally to switch tabs'),
                    Text::make('Tab label', 'label')
                        ->required()
                        ->unescape()
                        ->placeholder('Stationary')
                        ->hint('Visible text on the tab button'),
                    Image::make('Image', 'image')
                        ->disk('public')
                        ->dir('pages/specs')
                        ->removable(),
                    Text::make('Title', 'title')->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Potential uses', 'potential_uses', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->default('Potential uses of the equipment')
                    ->unescape(),
                Json::make('Tabs', 'tabs')->fields([
                    Text::make('Tab key (unique)', 'key')
                        ->required()
                        ->placeholder('educate')
                        ->hint('Slug-like identifier (latin chars, no spaces); used internally to switch tabs')
                        ->unescape(),
                    Text::make('Tab label', 'label')
                        ->required()
                        ->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                    Json::make('Cards', 'cards')->fields([
                        Image::make('Image', 'image')
                            ->disk('public')
                            ->dir('pages/hospital_equipment/potential_uses')
                            ->removable(),
                        Text::make('Title', 'title')->unescape(),
                        Text::make('Title link', 'titleHref')
                            ->nullable()
                            ->hint('Optional URL; makes the card title clickable'),
                        TinyMce::make('Description', 'description')->unescape(),
                    ])->vertical()->creatable()->removable(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Appreciation letters', 'appreciation_letters', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->default('Letters of Appreciation')
                    ->unescape(),
                Number::make('Default limit', 'query.limit')
                    ->min(1)
                    ->max(20)
                    ->default(3),
                Json::make('Tabs', 'tabs')->fields([
                    Text::make('Tab key (unique)', 'key')
                        ->required()
                        ->placeholder('all')
                        ->hint('Slug-like identifier (latin chars, no spaces); used internally to switch tabs')
                        ->unescape(),
                    Text::make('Tab label', 'label')
                        ->required()
                        ->unescape(),
                    Number::make('Limit override', 'limit')
                        ->min(1)
                        ->max(20)
                        ->nullable(),
                    Select::make('Items (articles)', 'items')
                        ->options(fn () => \App\Models\Article::orderByDesc('published_at')->limit(200)->pluck('title', 'slug')->toArray())
                        ->multiple()
                        ->searchable()
                        ->placeholder('Choose specific articles; overrides filters when set'),
                    Json::make('Filters', 'filters')->fields([
                        Select::make('Key', 'key')
                            ->options([
                                'type' => 'type (news, case_study, ...)',
                                'category' => 'category slug',
                                'slug' => 'slug',
                                'title' => 'title (ilike %value%)',
                                'status' => 'status (published, draft, ...)',
                            ])
                            ->searchable()
                            ->nullable(false)
                            ->required(),
                        Text::make('Value', 'value')
                            ->unescape()
                            ->placeholder('news | case_study | schools | published'),
                    ])->creatable()->removable()->vertical(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Compare models', 'compare_models', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Feature grid', 'feature_grid', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Select::make('Template variant', 'variant')
                    ->options([
                        'plain' => 'Default (no card background)',
                        'colored' => 'Colored cards with decoration',
                        'colored-photo' => 'Colored cards with full-bleed photo',
                    ])
                    ->default('plain')
                    ->nullable(),
                Image::make('Background decoration (SVG)', 'decoration')
                    ->disk('public')
                    ->dir('pages/feature_grid/decoration')
                    ->allowedExtensions(['svg'])
                    ->removable()
                    ->nullable()
                    ->hint('Optional SVG with curved lines; rendered behind content when variant = colored'),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Columns', 'columns')->options([2 => '2', 3 => '3', 4 => '4'])->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                    Image::make('Photo', 'photo')
                        ->disk('public')
                        ->dir('pages/feature_grid/photos')
                        ->removable()
                        ->hint('Optional large photo; when set, replaces icon'),
                    Image::make('Icon', 'icon')
                        ->disk('public')
                        ->dir('pages/feature_grid/icons')
                        ->removable()
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Product carousel', 'product_carousel', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Items (products)', 'query.items')
                    ->options(fn () => Product::orderBy('name')->limit(200)->pluck('name', 'slug')->toArray())
                    ->multiple()
                    ->searchable()
                    ->placeholder('Choose products to pin order; overrides filters/limit when set'),
                Number::make('Limit', 'query.limit')->min(1)->max(100)->default(12),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'slug' => 'slug',
                        'name' => 'name',
                        'slogan' => 'slogan',
                        'hero_image' => 'hero_image',
                    ])
                    ->multiple()
                    ->searchable(),
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'slug' => 'slug',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Games gallery', 'games_gallery', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Items (games)', 'query.items')
                    ->options(fn () => Game::orderBy('title')->limit(200)->pluck('title', 'slug')->toArray())
                    ->multiple()
                    ->searchable()
                    ->placeholder('Choose games to pin order; overrides filters/limit when set'),
                Number::make('Limit', 'query.limit')->min(1)->max(100)->default(12),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'slug' => 'slug',
                        'title' => 'title',
                        'hero_image' => 'hero_image',
                        'genre' => 'genre',
                        'target_age' => 'target_age',
                    ])
                    ->multiple()
                    ->searchable(),
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'genre' => 'genre',
                        'target_age' => 'target_age',
                        'slug' => 'slug',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Game detail', 'game_detail', [
                ...$this->paddingFields(),
                    Text::make('Slug', 'slug')
                        ->required()
                        ->hint('Slug of the Game record'),
            ])
            ->addLayout('Games grid', 'games_grid', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Items (games)', 'query.items')
                    ->options(fn () => Game::orderBy('title')->limit(200)->pluck('title', 'slug')->toArray())
                    ->multiple()
                    ->searchable()
                    ->placeholder('Choose games to pin order; overrides filters/limit when set'),
                Number::make('Limit', 'query.limit')->min(1)->max(100)->default(9),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'slug' => 'slug',
                        'title' => 'title',
                        'excerpt' => 'excerpt',
                        'hero_image' => 'hero_image',
                        'genre' => 'genre',
                        'target_age' => 'target_age',
                        'video_id' => 'video_id',
                        'game_type' => 'game_type',
                        'video_url' => 'video_url',
                    ])
                    ->multiple()
                    ->searchable(),
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'slug' => 'slug',
                        'title' => 'title',
                        'genre' => 'genre',
                        'target_age' => 'target_age',
                        'game_type' => 'game_type',
                        'video_id' => 'video_id',
                        'is_indexable' => 'is_indexable',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('News', 'news', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Items (articles)', 'query.items')
                    ->options(fn () => Article::orderByDesc('published_at')->limit(200)->pluck('title', 'slug')->toArray())
                    ->multiple()
                    ->searchable()
                    ->placeholder('Choose articles to pin order; overrides filters/limit when set'),
                Number::make('Limit', 'query.limit')->min(1)->max(50)->default(8),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'slug' => 'slug',
                        'title' => 'title',
                        'featured_image' => 'featured_image',
                        'published_at' => 'published_at',
                        'categories' => 'categories',
                    ])
                    ->multiple()
                    ->searchable(),
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'types' => 'types',
                        'category_slugs' => 'category_slugs',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Stats', 'stats', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Json::make('Items', 'items')->fields([
                    Text::make('Value', 'value')->unescape(),
                    Text::make('Label', 'label')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('FAQ', 'faq', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                Json::make('Items', 'items')->fields([
                    Text::make('Question', 'question')->unescape(),
                    TinyMce::make('Answer', 'answer')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Why us', 'why_us', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Discount banner', 'discount_banner', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape(),
                Text::make('CTA label', 'ctaLabel')
                    ->default('Live Demo')
                    ->unescape(),
                Text::make('CTA link', 'ctaHref')->default('#'),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/discount_banner/icons')
                    ->removable(),
            ])
            ->addLayout('Gradient form banner', 'gradient_form_banner', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape(),
                TinyMce::make('Description', 'description')
                    ->nullable()
                    ->unescape(),
                Select::make('Form', 'formCode')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->searchable()
                    ->required()
                    ->hint('Pick a form code from Forms; required for modal CTA.'),
                Text::make('Form title', 'formTitle')
                    ->nullable()
                    ->unescape()
                    ->hint('Optional modal title override (falls back to form title).'),
                Select::make('Template', 'template')
                    ->options([
                        'classic' => 'Classic (icon + text stack)',
                        'wide' => 'Wide (text left, CTA right)',
                    ])
                    ->default('classic'),
                Text::make('CTA label', 'ctaLabel')
                    ->default('Consultation')
                    ->unescape(),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/gradient_form_banner/icons')
                    ->removable(),
            ])
            ->addLayout('CTA section', 'cta_section', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('CTA label (form)', 'ctaLabel')
                    ->default('Contact us')
                    ->unescape()
                    ->hint('Used when a form is selected; opens modal'),
                Text::make('CTA label (link fallback)', 'ctaHrefLabel')
                    ->nullable()
                    ->unescape()
                    ->hint('Button text when no form is set; defaults to CTA label'),
                Text::make('CTA link', 'ctaHref')
                    ->default('#'),
                Select::make('Form', 'formCode')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->searchable()
                    ->nullable()
                    ->hint('When filled, the button opens a modal instead of navigating'),
                Text::make('Form title', 'formTitle')
                    ->nullable()
                    ->unescape()
                    ->hint('Optional override for modal title'),
                Color::make('Text color', 'textColor')
                    ->nullable()
                    ->hint('Optional HEX (e.g., #ffffff). Leave empty to keep default text color'),
                Image::make('Background image', 'backgroundImage')
                    ->disk('public')
                    ->dir('pages/cta')
                    ->removable(),
            ])
            ->addLayout('Highlight CTA', 'highlight_cta', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Learn more')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('#'),
            ])
            ->addLayout('Hospital equipment', 'hospital_equipment', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->unescape(),
                TinyMce::make('Description', 'description')
                    ->unescape(),
                Json::make('Features', 'features')->fields([
                    Text::make('Title', 'title')->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                    Image::make('Icon', 'icon')
                        ->disk('public')
                        ->dir('pages/hospital_equipment/features')
                        ->removable(),
                ])->vertical()->creatable()->removable(),
                Text::make('CTA title', 'ctaTitle')
                    ->unescape(),
                Text::make('CTA gradient line', 'ctaGradient')
                    ->unescape(),
                TinyMce::make('CTA description', 'ctaDescription')
                    ->unescape(),
                Text::make('CTA label', 'ctaLabel')
                    ->unescape(),
                Text::make('CTA link', 'ctaHref')
                    ->unescape(),
                Image::make('CTA background', 'ctaBackground')
                    ->disk('public')
                    ->dir('pages/hospital_equipment/cta')
                    ->removable(),
                Text::make('Footer title', 'footerTitle')
                    ->unescape(),
                TinyMce::make('Footer description', 'footerDescription')->unescape(),
                Image::make('Footer icon', 'footerIcon')
                    ->disk('public')
                    ->dir('pages/hospital_equipment/footer')
                    ->removable(),
            ])
            ->addLayout('Team grid', 'team_grid', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->default('Leadership')
                    ->unescape(),
                Select::make('Items (team members)', 'query.items')
                    ->options(fn () => \App\Models\TeamMember::query()->orderBy('position')->pluck('name', 'slug')->toArray())
                    ->multiple()
                    ->searchable()
                    ->placeholder('Choose members to pin order; overrides filters/limit when set'),
                Number::make('Limit', 'query.limit')->min(1)->max(100)->default(15),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'slug' => 'slug',
                        'name' => 'name',
                        'role' => 'role',
                        'department' => 'department',
                        'photo' => 'photo',
                        'bio' => 'bio',
                        'position' => 'position',
                        'is_active' => 'is_active',
                    ])
                    ->multiple()
                    ->searchable(),
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'slug' => 'slug',
                        'name' => 'name',
                        'role' => 'role',
                        'department' => 'department',
                        'is_active' => 'is_active',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->vertical()->creatable()->removable()->hint('Ignored when manual items are set'),
            ])
            ->addLayout('Content highlight', 'team_highlight', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                TinyMce::make('Section title', 'title')->unescape(),
                TinyMce::make('Section description', 'description')->unescape(),
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('pages/content_highlight')
                    ->removable(),
                Text::make('Alt text', 'alt')->unescape()->nullable(),
                TinyMce::make('Card title', 'cardTitle')->unescape(),
                TinyMce::make('Card description', 'cardDescription')->unescape(),
                TinyMce::make('Footer title', 'footerTitle')->unescape(),
                TinyMce::make('Footer text', 'footerText')->unescape(),
            ])
            ->addLayout('Custom software', 'custom_software', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('Grid title', 'gridTitle')->unescape(),
                Json::make('Items', 'items')->fields([
                    Text::make('Text', 'text')->required()->unescape(),
                ])->vertical()->creatable()->removable(),
                TinyMce::make('Footer text', 'footerText')->unescape()->nullable(),
            ])
            ->addLayout('Free game distribution', 'game_distribution', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('pages/game_distribution')
                    ->removable(),
                Text::make('Video ID (YouTube)', 'videoId')->unescape()->nullable(),
                Text::make('Alt text', 'alt')->unescape()->nullable(),
            ])
            ->addLayout('Practice showcase', 'practice_showcase', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Image', 'image')
                    ->disk('public')
                    ->dir('pages/practice_showcase')
                    ->removable(),
                Text::make('Video ID (YouTube)', 'videoId')->unescape()->nullable(),
                Text::make('Alt text', 'alt')->unescape()->nullable(),
            ])
            ->addLayout('Research', 'research', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                Text::make('Left title', 'leftTitle')->unescape(),
                TinyMce::make('Left text', 'leftText')->unescape(),
                Image::make('Person photo', 'personImage')
                    ->disk('public')
                    ->dir('pages/research')
                    ->removable(),
                Text::make('Person photo alt', 'personAlt')->nullable()->unescape(),
                Text::make('Person name', 'personName')->unescape(),
                TinyMce::make('Person text', 'personText')->unescape(),
                TinyMce::make('Description (below divider)', 'description')->unescape(),
                Text::make('Video ID (YouTube)', 'videoId')->unescape()->nullable(),
                Text::make('Learn more link', 'learnMoreHref')->default('#')->unescape(),
            ])
            ->addLayout('Research results', 'research_results', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape()->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->required()->unescape(),
                    Textarea::make('Text', 'text')->unescape()->nullable(),
                ])->vertical()->creatable()->removable(),
                Image::make('Decoration (desktop)', 'decoration')
                    ->disk('public')
                    ->dir('pages/research_results')
                    ->removable()
                    ->hint('Optional; defaults to bundled SVG if empty'),
                Image::make('Decoration (mobile)', 'decorationMobile')
                    ->disk('public')
                    ->dir('pages/research_results')
                    ->removable()
                    ->hint('Optional; defaults to bundled SVG if empty'),
            ])
            ->addLayout('Exclusive offer', 'exclusive_offer', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape()->default('Exclusive offer'),
                TinyMce::make('Description', 'description')->unescape()->nullable(),
                Select::make('Default form', 'defaultFormCode')
                    ->nullable()
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->searchable()
                    ->hint('Optional fallback form for all CTAs if item form is empty'),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->required()->unescape(),
                    TinyMce::make('Text', 'text')->unescape()->nullable(),
                    Text::make('CTA label', 'ctaLabel')->default('Consultation')->unescape(),
                    Select::make('Form', 'formCode')
                        ->nullable()
                        ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                        ->searchable(),
                    Text::make('Form title', 'formTitle')
                        ->nullable()
                        ->unescape()
                        ->hint('Overrides modal title; falls back to form title then CTA title'),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Summer Camp', 'summer_camp', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape()->default('Summer Camp'),
                TinyMce::make('Description', 'description')->unescape()->nullable(),
                Json::make('Features', 'features')->fields([
                    Text::make('Label', 'label')->required()->unescape(),
                    Text::make('Value', 'value')->required()->unescape(),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/summer_camp/icons')
                    ->removable()
                    ->nullable(),
                ])->vertical()->creatable()->removable(),
                Text::make('Video ID (YouTube)', 'videoId')->unescape()->nullable(),
                Text::make('Learn more link', 'learnMoreHref')->unescape()->default('#')->nullable(),
            ])
            ->addLayout('Special needs videos', 'special_needs', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->default('Special Needs')
                    ->unescape(),
                TinyMce::make('Description', 'description')
                    ->unescape(),
                Json::make('Videos', 'videos')->fields([
                    Text::make('Video ID (YouTube)', 'videoId')
                        ->unescape()
                        ->hint('YouTube video ID; used for modal playback'),
                    Text::make('Alt text', 'alt')->unescape(),
                ])->vertical()->creatable()->removable(),
            ])
            ->addLayout('Reviews', 'reviews', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Leave a review')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('#'),
                Select::make('Template', 'template')
                    ->options([
                        'featured' => 'Featured (large cards)',
                        'compact' => 'Compact (small cards)',
                    ])
                    ->default('featured'),
                Number::make('Fetch limit', 'query.limit')->min(1)->max(24)->default(12),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'name' => 'name',
                        'review_date' => 'review_date',
                        'rating' => 'rating',
                        'text' => 'text',
                        'avatar' => 'avatar',
                        'source_url' => 'source_url',
                        'position' => 'position',
                    ])
                    ->multiple()
                    ->searchable(),
                Select::make('Specific reviews', 'query.ids')
                    ->options(fn () => Review::ordered()->pluck('name', 'id')->toArray())
                    ->multiple()
                    ->searchable(),
            ])
            ->addLayout('Rating summary', 'rating_summary', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')
                    ->unescape()
                    ->default('We strive to be the best for every client'),
                Number::make('Rating value', 'rating')
                    ->min(0)
                    ->max(5)
                    ->step(0.1)
                    ->default(5.0)
                    ->hint('Displayed as 5.0 with 5 stars'),
                Text::make('CTA label', 'ctaLabel')
                    ->default('View all reviews')
                    ->unescape(),
                Text::make('CTA link', 'ctaHref')
                    ->default('#'),
                TinyMce::make('Footer text', 'footerText')
                    ->unescape()
                    ->nullable()
                    ->hint('Optional paragraph under the button'),
            ])
            ->addLayout('Trusted by', 'trusted_by', [
                ...$this->paddingFields(),
                ...$this->backgroundColorFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                TinyMce::make('Footer text', 'footerText')->unescape(),
                Select::make('Fields', 'query.fields')
                    ->options([
                        'image' => 'image',
                        'alt' => 'alt',
                        'position' => 'position',
                    ])
                    ->multiple()
                    ->searchable(),
            ]);

        // Add clipboard copy control to every layout heading
        $layouts->getLayouts()->each(function ($layout): void {
            if ($layout instanceof LayoutBlock) {
                $layout->headingAdditionalFields(
                    $this->layoutClipboardHeadingComponents($layout->name()),
                );
            }
        });

        return [
            Box::make('Page', [
                ID::make(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape()
                    ->reactive(debounce: 300),
                Slug::make('Slug', 'slug')
                    ->from('title')
                    ->live()
                    ->locale('ru'),
                Select::make('Type', 'type')->options([
                    'product_landing' => 'Product landing',
                    'static' => 'Static',
                ])->default('static'),
                Select::make('Product', 'product_id')
                    ->options(fn () => Product::orderBy('name')->pluck('name', 'id')->toArray())
                    ->nullable()
                    ->searchable(),
                Select::make('Status', 'status')
                    ->options(['draft' => 'Draft', 'published' => 'Published'])
                    ->default('draft'),
                Date::make('Published at', 'published_at')
                    ->format('Y-m-d H:i')
                    ->withTime()
                    ->default(now()->format('Y-m-d\\TH:i')),
            ]),

            Box::make('SEO', [
                Text::make('SEO Title', 'seo_title')->unescape(),
                Textarea::make('SEO Description', 'seo_description')->unescape(),
                Text::make('Canonical URL', 'seo_canonical'),
                Image::make('OG Image', 'seo_og_image')
                    ->disk('public')
                    ->dir('seo')
                    ->removable(),
            ]),

            Box::make('Content blocks', [
                $layouts,
            ]),
        ];
    }

    /**
     * Ensure dot-notated child fields inside layouts (e.g. padding.top) are read from nested request arrays.
     */
    private function applyLayoutsWithDotSupport(): Closure
    {
        return static function (mixed $item, mixed $value, FieldContract $field) {
            $requestValues = array_filter($field->getRequestValue() ?: []);

            $data = collect($requestValues)->map(function (array $value, int $index) use ($field) {
                $layout = $field->getLayouts()->findByName($value['_layout'] ?? null);
                unset($value['_layout']);

                if (is_null($layout)) {
                    return [];
                }

                $applyValues = [];

                $layout->fields()->onlyFields()->each(
                    function (FieldContract $inner) use ($value, $index, &$applyValues, $field): void {
                        $inner->appendRequestKeyPrefix(
                            "{$field->getColumn()}.$index",
                            $field->getRequestKeyPrefix(),
                        );

                        $raw = data_get($value, $inner->getColumn());

                        if ($raw === null && array_key_exists($inner->getColumn(), $value)) {
                            $raw = $value[$inner->getColumn()];
                        }

                        $applied = $inner->apply(
                            fn ($data): mixed => data_set($data, $inner->getColumn(), $raw),
                            $value,
                        );

                        data_set(
                            $applyValues,
                            $inner->getColumn(),
                            data_get($applied, $inner->getColumn()),
                        );
                    },
                );

                return [
                    'key' => $index,
                    'name' => $layout->name(),
                    'values' => $applyValues,
                ];
            })->filter();

            data_set($item, $field->getColumn(), $data);

            return $item;
        };
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    protected function formButtons(): ListOf
    {
        return parent::formButtons();
    }

    protected function rules(DataWrapperContract $item): array
    {
        $id = $this->getResource()?->getItem()?->getKey();

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pages', 'slug')->ignore($id),
            ],
        ];
    }

    /**
     * @param  FormBuilder  $component
     *
     * @return FormBuilder
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
