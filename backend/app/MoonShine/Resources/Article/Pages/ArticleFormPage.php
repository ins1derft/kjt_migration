<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Article\Pages;

use App\MoonShine\Resources\Article\ArticleResource;
use App\MoonShine\Resources\ArticleCategory\ArticleCategoryResource;
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
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Text as TextField;
use MoonShine\UI\Fields\Textarea;
use Throwable;

/**
 * @extends FormPage<ArticleResource>
 */
class ArticleFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Article', [
                ID::make(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape()
                    ->reactive(debounce: 300),
                Slug::make('Slug', 'slug')
                    ->from('title')
                    ->live()
                    ->locale('ru'),
                Select::make('Status', 'status')->options([
                    'draft' => 'Draft',
                    'published' => 'Published',
                ])->default('draft'),
                BelongsToMany::make('Categories', 'categories', 'name', ArticleCategoryResource::class)
                    ->searchable(),
                TinyMce::make('Excerpt', 'excerpt')->unescape(),
                TinyMce::make('Body', 'body')->required()->unescape(),
                Image::make('Featured image', 'featured_image')->disk('public')->dir('articles')->removable(),
                TextField::make('Video ID (YouTube)', 'video_id')
                    ->hint('Example: dQw4w9WgXcQ')
                    ->nullable(),
                Date::make('Published at', 'published_at')
                    ->format('Y-m-d H:i')
                    ->withTime()
                    ->default(now()->format('Y-m-d\\TH:i')),
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
                Rule::unique('articles', 'slug')->ignore($id),
            ],
            'body' => ['required', 'string'],
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
