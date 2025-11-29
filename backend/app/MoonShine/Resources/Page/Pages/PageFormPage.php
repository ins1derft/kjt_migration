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
                        Textarea::make('Subtitle', 'subtitle'),
                        Text::make('Badge', 'badge'),
                        Image::make('Background image', 'background')
                            ->disk('public')
                            ->dir('pages/hero')
                            ->removable(),
                        Text::make('Primary CTA label', 'primary_cta_label'),
                        Text::make('Primary CTA URL', 'primary_cta_url'),
                        Text::make('Secondary CTA label', 'secondary_cta_label'),
                        Text::make('Secondary CTA URL', 'secondary_cta_url'),
                    ])
                    ->addLayout('Features grid', 'features_grid', [
                        Text::make('Block title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Title', 'title'),
                            Textarea::make('Text', 'text'),
                            Text::make('Icon key', 'icon'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Games list', 'games_list', [
                        Text::make('Title', 'title'),
                        Select::make('Device type', 'device_type')->options([
                            'floor' => 'Interactive floor',
                            'wall' => 'Interactive wall',
                            'sandbox' => 'Sandbox',
                            'generic' => 'Generic',
                        ]),
                        Switcher::make('Auto from games', 'auto_fill')
                            ->default(false),
                        Select::make('Games', 'game_slugs')
                            ->options(fn () => Game::orderBy('title')->pluck('title', 'slug')->toArray())
                            ->multiple()
                            ->searchable()
                            ->nullable(),
                    ])
                    ->addLayout('News / Case studies list', 'news_list', [
                        Text::make('Title', 'title'),
                        Json::make('Filters', 'filters')->fields([
                            Text::make('Types (comma-separated)', 'types'),
                            Text::make('Category slugs', 'category_slugs'),
                            Text::make('Limit', 'limit'),
                        ]),
                    ])
                    ->addLayout('Quote form', 'quote_form', [
                        Text::make('Title', 'title'),
                        Textarea::make('Body', 'body'),
                        Select::make('Form code', 'form_code')
                            ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                            ->searchable()
                            ->required()
                            ->placeholder('Select form'),
                    ])
                    ->addLayout('Icon bullets', 'icon_bullets', [
                        Text::make('Title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Icon', 'icon'),
                            Text::make('Heading', 'heading'),
                            Textarea::make('Text', 'text'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Stats', 'stats', [
                        Text::make('Title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Value', 'value'),
                            Text::make('Label', 'label'),
                            Text::make('Suffix', 'suffix'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Logos strip', 'logos', [
                        Text::make('Title', 'title'),
                        Json::make('Logos', 'logos')->fields([
                            Image::make('Image', 'image')
                                ->disk('public')
                                ->dir('logos')
                                ->removable(),
                            Text::make('Alt', 'alt'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Comparison table', 'comparison_table', [
                        Text::make('Title', 'title'),
                        Hidden::make('Auto fill variants', 'auto_fill')->default(true),
                    ])
                    ->addLayout('Games gallery', 'games_gallery', [
                        Text::make('Title', 'title'),
                        Switcher::make('Auto from games', 'auto_fill')
                            ->default(false),
                        Select::make('Games', 'game_slugs')
                            ->options(fn () => Game::orderBy('title')->pluck('title', 'slug')->toArray())
                            ->multiple()
                            ->searchable()
                            ->nullable(),
                        Text::make('Limit', 'limit'),
                    ])
                    ->addLayout('Use cases', 'use_cases', [
                        Text::make('Title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Heading', 'heading'),
                            Textarea::make('Body', 'body'),
                            Text::make('Link label', 'cta_label'),
                            Text::make('Link URL', 'cta_url'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('FAQ', 'faq', [
                        Text::make('Title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Question', 'question'),
                            Textarea::make('Answer', 'answer'),
                        ])->creatable()->removable(),
                    ])
                    ->addLayout('Reviews feed', 'reviews_feed', [
                        Text::make('Title', 'title'),
                        Text::make('Rating', 'rating'),
                        Text::make('Count', 'count'),
                        Text::make('Provider', 'provider'),
                        Textarea::make('Embed code', 'embed_code'),
                    ])
                    ->addLayout('Product cards', 'product_cards', [
                        Text::make('Title', 'title'),
                        Json::make('Items', 'items')->fields([
                            Text::make('Title', 'title'),
                            Text::make('Subtitle', 'subtitle'),
                            Text::make('Image', 'image'),
                            Text::make('URL', 'url'),
                        ])->creatable()->removable(),
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
