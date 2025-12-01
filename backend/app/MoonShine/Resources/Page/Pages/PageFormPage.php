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
use App\Models\Review;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Layouts\Fields\Layouts;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Fields\Number;
use App\Models\Form;
use App\Models\Game;
use MoonShine\TinyMce\Fields\TinyMce;
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
        $options = [
            null => 'Default',
            'none' => '0 (none)',
            'xs' => 'XS (8)',
            'sm' => 'SM (12)',
            'md' => 'MD (16)',
            'lg' => 'LG (20)',
            'xl' => 'XL (24)',
            '2xl' => '2XL (32)',
        ];

        return [
            Select::make('Padding top', 'padding.top')->options($options)->nullable(),
            Select::make('Padding bottom', 'padding.bottom')->options($options)->nullable(),
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
                Json::make('Slides', 'slides')->fields([
                    Text::make('Video ID (YouTube)', 'videoId')->required(),
                    Text::make('Alt text', 'alt')->unescape(),
                ])->creatable()->removable(),
            ])
            ->addLayout('Hero content', 'hero_content', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                Text::make('Subtitle', 'subtitle')->unescape(),
                TinyMce::make('Text', 'text')->unescape(),
                Text::make('CTA label', 'ctaLabel')->default('Live Demo')->unescape(),
                Text::make('CTA link', 'ctaHref')->default('mailto:info@kidsjumptech.com?subject=Live%20Demo'),
            ])
            ->addLayout('Product description', 'product_description', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
            ])
            ->addLayout('Product nav', 'product_nav', [
                Json::make('Items', 'items')->fields([
                    Text::make('Label', 'label')->required()->unescape(),
                    Text::make('Anchor id', 'anchor')
                        ->required()
                        ->placeholder('description')
                        ->hint('ID целевого блока без #, например description, specs, faq'),
                ])->creatable()->removable(),
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
                Json::make('Badges', 'badges')->fields([
                    Image::make('Image', 'image')
                        ->disk('public')
                        ->dir('products/badges')
                        ->removable(),
                    Text::make('Label', 'label')->unescape(),
                ])->creatable()->removable(),
                Text::make('CTA label', 'ctaLabel')->default('Get a Quote')->unescape(),
                Text::make('Form code', 'formCode')->hint('Overrides product.form.code'),
                Text::make('Form title', 'formTitle')->unescape()->hint('Optional modal title override'),
            ])
            ->addLayout('Product specs', 'product_specs', [
                ...$this->paddingFields(),
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
                ])->creatable()->removable(),
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
                Select::make('Icon color', 'iconColor')->options([
                    'brand' => 'Brand',
                    'sky' => 'Sky',
                    'orange' => 'Orange',
                ])->nullable(),
                Select::make('Variant', 'variant')->options([
                    'values' => 'Values',
                    'features' => 'Features',
                    'centered' => 'Centered',
                ])->nullable(),
                Json::make('Items', 'items')->fields([
                    Text::make('Title', 'title')->unescape(),
                    TinyMce::make('Description', 'description')->unescape(),
                    Text::make('Icon key', 'icon'),
                ])->creatable()->removable(),
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
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'slug' => 'slug',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->creatable()->removable(),
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
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'genre' => 'genre',
                        'target_age' => 'target_age',
                        'slug' => 'slug',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->creatable()->removable(),
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
                Json::make('Filters', 'query.filter')->fields([
                    Select::make('Field', 'field')->options([
                        'types' => 'types',
                        'category_slugs' => 'category_slugs',
                    ])->required(),
                    Text::make('Value', 'value')->required(),
                ])->creatable()->removable(),
            ])
            ->addLayout('Stats', 'stats', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Json::make('Items', 'items')->fields([
                    Text::make('Value', 'value')->unescape(),
                    Text::make('Label', 'label')->unescape(),
                ])->creatable()->removable(),
            ])
            ->addLayout('FAQ', 'faq', [
                ...$this->paddingFields(),
                Text::make('Title', 'title')->unescape(),
                Json::make('Items', 'items')->fields([
                    Text::make('Question', 'question')->unescape(),
                    TinyMce::make('Answer', 'answer')->unescape(),
                ])->creatable()->removable(),
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
                Json::make('Items', 'items')->fields([
                    Text::make('Name', 'name')->unescape(),
                    Text::make('Date', 'date')->unescape(),
                    Number::make('Rating', 'rating')->min(1)->max(5)->default(5),
                    TinyMce::make('Text', 'text')->unescape(),
                    Image::make('Avatar', 'avatar')
                        ->disk('public')
                        ->dir('reviews')
                        ->removable(),
                ])->creatable()->removable(),
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
                TinyMce::make('SEO Description', 'seo_description')->unescape(),
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
