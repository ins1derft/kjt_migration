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
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Layouts\Fields\Layouts;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Fields\Number;
use App\Models\Game;
use App\Models\Form;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\Laravel\Fields\Relationships\HasMany;
use App\MoonShine\Resources\PageBlock\HeroSlideResource;
use App\MoonShine\Resources\PageBlock\HeroValueItemResource;
use App\MoonShine\Resources\PageBlock\ProductNavItemResource;
use App\MoonShine\Resources\PageBlock\InteractiveShowcaseItemResource;
use App\MoonShine\Resources\PageBlock\ProductHeroBadgeResource;
use App\MoonShine\Resources\PageBlock\ProductSpecTabResource;
use App\MoonShine\Resources\PageBlock\FeatureGridItemResource;
use App\MoonShine\Resources\PageBlock\ProductCarouselFilterResource;
use App\MoonShine\Resources\PageBlock\GamesGalleryFilterResource;
use App\MoonShine\Resources\PageBlock\GamesGridFilterResource;
use App\MoonShine\Resources\PageBlock\NewsFilterResource;
use App\MoonShine\Resources\PageBlock\StatItemResource;
use App\MoonShine\Resources\PageBlock\FaqItemResource;
use App\MoonShine\Resources\PageBlock\ReviewItemResource;
use Closure;
use Throwable;


/**
 * @extends FormPage<PageResource>
 */
class PageFormPage extends FormPage
{
    /**
     * Reusable padding selectors for block layouts.
     *
     * @return list<FieldContract>
     */
    private function paddingFields(): array
    {
        return [
            Number::make('Padding top', 'padding.top')
                ->min(0)
                ->step(1)
                ->nullable()
                ->hint('px; leave empty to use the default for this block'),
            Number::make('Padding bottom', 'padding.bottom')
                ->min(0)
                ->step(1)
                ->nullable()
                ->hint('px; leave empty to use the default for this block'),
        ];
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
                Text::make('Title', 'title')->unescape(),
                HasMany::make('Slides', 'heroSlides', HeroSlideResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Page header', 'page_header', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->required()->unescape(),
            ])
            ->addLayout('Hero + Values', 'hero_values', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                Text::make('Subtitle', 'subtitle')->unescape(),
                TinyMce::make('Text', 'text')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Live Demo')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('mailto:info@kidsjumptech.com?subject=Live%20Demo'),
                Select::make('Columns', 'columns')->options([2 => '2', 3 => '3', 4 => '4'])->nullable(),
                HasMany::make('Items', 'heroValueItems', HeroValueItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Product description', 'product_description', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Product nav', 'product_nav', [
                HasMany::make('Items', 'productNavItems', ProductNavItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Our approach', 'our_approach', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape()->default('Our Approach'),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Interactive showcase', 'interactive_header', [
                ...$this->paddingFields(),
                Select::make('Default form', 'defaultFormCode')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->nullable()
                    ->searchable()
                    ->hint('If set, CTAs without formCode will open this form code'),
                HasMany::make('Items', 'interactiveShowcaseItems', InteractiveShowcaseItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Product hero', 'product_hero', [
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
                HasMany::make('Badges', 'productHeroBadges', ProductHeroBadgeResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
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
                HasMany::make('Tabs', 'productSpecTabs', ProductSpecTabResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Compare models', 'compare_models', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Feature grid', 'feature_grid', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Select::make('Columns', 'columns')->options([2 => '2', 3 => '3', 4 => '4'])->nullable(),
                HasMany::make('Items', 'featureGridItems', FeatureGridItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Product carousel', 'product_carousel', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
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
                HasMany::make('Filters', 'productCarouselFilters', ProductCarouselFilterResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Games gallery', 'games_gallery', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
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
                HasMany::make('Filters', 'gamesGalleryFilters', GamesGalleryFilterResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Game detail', 'game_detail', [
                ...$this->paddingFields(),
                    Text::make('Slug', 'slug')
                        ->required()
                        ->hint('Slug of the Game record'),
            ])
            ->addLayout('Games grid', 'games_grid', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
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
                HasMany::make('Filters', 'gamesGridFilters', GamesGridFilterResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('News', 'news', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
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
                HasMany::make('Filters', 'newsFilters', NewsFilterResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Stats', 'stats', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                HasMany::make('Items', 'statItems', StatItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('FAQ', 'faq', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                HasMany::make('Items', 'faqItems', FaqItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Why us', 'why_us', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('CTA section', 'cta_section', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Contact us')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('#'),
                Text::make('Text color classes', 'textColorClass')
                    ->unescape()
                    ->hint('Tailwind/utility classes to override text color (e.g., text-white, text-brand-dark)'),
                Image::make('Background image', 'backgroundImage')
                    ->disk('public')
                    ->dir('pages/cta')
                    ->removable(),
            ])
            ->addLayout('Highlight CTA', 'highlight_cta', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Learn more')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('#'),
            ])
            ->addLayout('Reviews', 'reviews', [
                ...$this->paddingFields(),
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
                HasMany::make('Items', 'reviewItems', ReviewItemResource::class)
                    ->creatable()
                    ->tabMode()
                    ->sortable(),
            ])
            ->addLayout('Trusted by', 'trusted_by', [
                ...$this->paddingFields(),
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

        // Hidden relation hooks so HasManyController can always resolve relations nested in layouts.
        $relationHooks = [
            HasMany::make('heroSlides', 'heroSlides', HeroSlideResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('heroValueItems', 'heroValueItems', HeroValueItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('productNavItems', 'productNavItems', ProductNavItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('interactiveShowcaseItems', 'interactiveShowcaseItems', InteractiveShowcaseItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('productHeroBadges', 'productHeroBadges', ProductHeroBadgeResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('productSpecTabs', 'productSpecTabs', ProductSpecTabResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('featureGridItems', 'featureGridItems', FeatureGridItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('productCarouselFilters', 'productCarouselFilters', ProductCarouselFilterResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('gamesGalleryFilters', 'gamesGalleryFilters', GamesGalleryFilterResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('gamesGridFilters', 'gamesGridFilters', GamesGridFilterResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('newsFilters', 'newsFilters', NewsFilterResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('statItems', 'statItems', StatItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('faqItems', 'faqItems', FaqItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
            HasMany::make('reviewItems', 'reviewItems', ReviewItemResource::class)
                ->disableOutside()
                ->canSee(fn () => request()->has('_relation')),
        ];

        return [
            Box::make('Page', [
                ID::make(),
                Text::make('Title', 'title')->required()->unescape(),
                Slug::make('Slug', 'slug')->from('title'),
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
                Date::make('Published at', 'published_at')->format('Y-m-d H:i'),
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
                ...$relationHooks,
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
            $relationColumns = [
                'heroSlides',
                'heroValueItems',
                'productNavItems',
                'interactiveShowcaseItems',
                'productHeroBadges',
                'productSpecTabs',
                'featureGridItems',
                'productCarouselFilters',
                'gamesGalleryFilters',
                'gamesGridFilters',
                'newsFilters',
                'statItems',
                'faqItems',
                'reviewItems',
            ];

            $data = collect($requestValues)->map(function (array $value, int $index) use ($field, $relationColumns) {
                $layout = $field->getLayouts()->findByName($value['_layout'] ?? null);
                unset($value['_layout']);

                if (is_null($layout)) {
                    return [];
                }

                $applyValues = [];

                $layout->fields()->onlyFields()->each(
                    function (FieldContract $inner) use ($value, $index, &$applyValues, $field, $relationColumns): void {
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

                        if (!in_array($inner->getColumn(), $relationColumns, true)) {
                            data_set(
                                $applyValues,
                                $inner->getColumn(),
                                data_get($applied, $inner->getColumn()),
                            );
                        }
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
