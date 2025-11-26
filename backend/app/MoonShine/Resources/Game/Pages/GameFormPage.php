<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Game\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\Game\GameResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use Illuminate\Validation\Rule;
use MoonShine\UI\Fields\Text;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\UI\Fields\Textarea;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
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
                Text::make('Title', 'title')->required(),
                Slug::make('Slug', 'slug')->from('title'),
                Text::make('Genre', 'genre'),
                Text::make('Target age', 'target_age'),
                Textarea::make('Excerpt', 'excerpt'),
                Textarea::make('Body', 'body'),
                Image::make('Hero image', 'hero_image')->disk('public')->dir('games'),
                BelongsToMany::make('Categories', 'categories', 'name')->searchable(),
            ]),
            Box::make('SEO', [
                Text::make('SEO Title', 'seo_title'),
                Textarea::make('SEO Description', 'seo_description'),
                Text::make('Canonical URL', 'seo_canonical'),
                Image::make('OG Image', 'seo_og_image')->disk('public')->dir('seo'),
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
