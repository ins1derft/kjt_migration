<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Game\Pages;

use App\MoonShine\Resources\Game\GameResource;
use App\MoonShine\Resources\GameCategory\GameCategoryResource;
use App\MoonShine\Resources\Product\ProductResource;
use Illuminate\Validation\Rule;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Support\ListOf;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use Throwable;

/**
 * @extends FormPage<GameResource>
 */
class GameFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Game', [
                ID::make(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape()
                    ->reactive(debounce: 300),
                Slug::make('Slug', 'slug')
                    ->from('title')
                    ->live()
                    ->locale('ru'),
                Text::make('Genre', 'genre'),
                Text::make('Target age', 'target_age'),
                TinyMce::make('Excerpt', 'excerpt')->unescape(),
                TinyMce::make('Body', 'body')->unescape(),
                Image::make('Hero image', 'hero_image')->disk('public')->dir('games')->removable(),
                Text::make('Video ID (YouTube)', 'video_id')
                    ->hint('Example: dQw4w9WgXcQ')
                    ->nullable(),
                BelongsToMany::make('Products', 'products', 'name', ProductResource::class)
                    ->searchable(),
                BelongsToMany::make('Categories', 'categories', 'name', GameCategoryResource::class)
                    ->searchable(),
            ]),
            Box::make('SEO', [
                Text::make('SEO Title', 'seo_title')->unescape(),
                Textarea::make('SEO Description', 'seo_description')->unescape(),
                Text::make('Canonical URL', 'seo_canonical'),
                Image::make('OG Image', 'seo_og_image')->disk('public')->dir('seo')->removable(),
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
                Rule::unique('games', 'slug')->ignore($id),
            ],
        ];
    }

    /**
     * @param  FormBuilder  $component
     * @return FormBuilder
     */
    protected function modifyFormComponent(FormBuilderContract $component): FormBuilderContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
