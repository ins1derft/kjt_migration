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
use Throwable;


/**
 * @extends FormPage<PageResource>
 */
class PageFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Page', [
                ID::make(),
                Text::make('Title', 'title')->required(),
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
                Text::make('SEO Title', 'seo_title'),
                Textarea::make('SEO Description', 'seo_description'),
                Text::make('Canonical URL', 'seo_canonical'),
                Image::make('OG Image', 'seo_og_image')
                    ->disk('public')
                    ->dir('seo')
                    ->removable(),
            ]),

            Box::make('Content blocks', [
                Layouts::make('Blocks', 'blocks')
                    ->addLayout('Hero', 'hero', [
                        Text::make('Title', 'title'),
                        Json::make('Slides', 'slides')->fields([
                            Text::make('Video ID (YouTube)', 'videoId')->required(),
                            Text::make('Alt text', 'alt'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Hero content', 'hero_content', [
                        Text::make('Title', 'title'),
                        Text::make('Subtitle', 'subtitle'),
                        Textarea::make('Text', 'text'),
                        Text::make('CTA label', 'ctaLabel')->default('Live Demo'),
                        Text::make('CTA link', 'ctaHref')->default('mailto:info@kidsjumptech.com?subject=Live%20Demo'),
                    ])
                    ->addLayout('Feature grid', 'feature_grid', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Select::make('Columns', 'columns')->options([2 => '2', 3 => '3', 4 => '4'])->nullable(),
                        Select::make('Icon color', 'iconColor')->options([
                            'brand' => 'Brand',
                            'sky' => 'Sky',
                            'orange' => 'Orange',
                        ])->nullable(),
                        Select::make('Variant', 'variant')->options([
                            'values' => 'Values',
                            'features' => 'Features',
                        ])->nullable(),
                        Json::make('Items', 'items')->fields([
                            Text::make('Title', 'title'),
                            Textarea::make('Description', 'description'),
                            Text::make('Icon key', 'icon'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Product carousel', 'product_carousel', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Number::make('Limit', 'query.limit')->min(1)->max(100)->default(12),
                        Select::make('Fields', 'query.fields')
                            ->options([
                                'slug' => 'slug',
                                'name' => 'name',
                                'slogan' => 'slogan',
                                'hero_image' => 'hero_image',
                                'product_type' => 'product_type',
                            ])
                            ->multiple()
                            ->searchable(),
                        Json::make('Filters', 'query.filter')->fields([
                            Select::make('Field', 'field')->options([
                                'product_type' => 'product_type',
                                'slug' => 'slug',
                            ])->required(),
                            Text::make('Value', 'value')->required(),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Games gallery', 'games_gallery', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
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
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
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
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Value', 'value'),
                            Text::make('Label', 'label'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Why us', 'why_us', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                    ])
                    ->addLayout('CTA section', 'cta_section', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Text::make('CTA label', 'ctaLabel')->default('Contact us'),
                        Text::make('CTA link', 'ctaHref')->default('#'),
                        Image::make('Background image', 'backgroundImage')
                            ->disk('public')
                            ->dir('pages/cta')
                            ->removable(),
                    ])
                    ->addLayout('Highlight CTA', 'highlight_cta', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Text::make('CTA label', 'ctaLabel')->default('Learn more'),
                        Text::make('CTA link', 'ctaHref')->default('#'),
                    ])
                    ->addLayout('Testimonials', 'testimonials', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Text::make('CTA label', 'ctaLabel')->default('Leave a review'),
                        Text::make('CTA link', 'ctaHref')->default('#'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Name', 'name'),
                            Text::make('Date', 'date'),
                            Number::make('Rating', 'rating')->min(1)->max(5)->default(5),
                            Textarea::make('Text', 'text'),
                            Image::make('Avatar', 'avatar')
                                ->disk('public')
                                ->dir('testimonials')
                                ->removable(),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Trusted by', 'trusted_by', [
                        Text::make('Title', 'title'),
                        Textarea::make('Description', 'description'),
                        Textarea::make('Footer text', 'footerText'),
                        Select::make('Fields', 'query.fields')
                            ->options([
                                'image' => 'image',
                                'alt' => 'alt',
                                'position' => 'position',
                            ])
                            ->multiple()
                            ->searchable(),
                    ]),
            ]),
        ];
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
