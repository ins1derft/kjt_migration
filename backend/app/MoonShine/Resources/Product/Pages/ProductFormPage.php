<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Product\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\Product\ProductResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use Illuminate\Validation\Rule;
use MoonShine\UI\Fields\Text;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\UI\Fields\Textarea;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use App\MoonShine\Resources\Industry\IndustryResource;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use App\MoonShine\Resources\Form\FormResource;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Number;
use MoonShine\TinyMce\Fields\TinyMce;
use Throwable;


/**
 * @extends FormPage<ProductResource>
 */
class ProductFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Product', [
                ID::make(),
                Text::make('Name', 'name')->required()->unescape(),
                Slug::make('Slug', 'slug')->from('name'),
                Text::make('Slogan', 'slogan')->unescape(),
                TinyMce::make('Excerpt', 'excerpt')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Hero image', 'hero_image')->disk('public')->dir('products')->removable(),
                Text::make('Default CTA label', 'default_cta_label'),
                Number::make('Rating', 'rating')->min(0)->max(5)->step(0.1)->nullable(),
                Text::make('Review count label', 'review_count_label'),
                Json::make('Badges', 'badges')->fields([
                    Image::make('Image', 'image')
                        ->disk('public')
                        ->dir('products/badges')
                        ->removable()
                        ->hint('Upload badge image; defaults to brand icons if empty'),
                ])->vertical()->creatable()->removable(),
                BelongsTo::make('Lead form', 'form', 'title', FormResource::class)
                    ->nullable()
                    ->searchable(),
                BelongsToMany::make('Industries', 'industries', 'name', IndustryResource::class)
                    ->searchable(),
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($id),
            ],
            'slogan' => ['nullable', 'string', 'max:255'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'review_count_label' => ['nullable', 'string', 'max:255'],
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
