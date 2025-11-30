<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\StoreProduct\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\StoreProduct\StoreProductResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use Illuminate\Validation\Rule;
use MoonShine\UI\Fields\Text;
use MoonShine\Laravel\Fields\Slug;
use MoonShine\UI\Fields\Textarea;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Switcher;
use MoonShine\Laravel\Fields\Relationships\BelongsToMany;
use MoonShine\UI\Components\Layout\Box;
use App\MoonShine\Resources\StoreCategory\StoreCategoryResource;
use MoonShine\TinyMce\Fields\TinyMce;
use Throwable;


/**
 * @extends FormPage<StoreProductResource>
 */
class StoreProductFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Store product', [
                ID::make(),
                Text::make('Name', 'name')->required()->unescape(),
                Slug::make('Slug', 'slug')->from('name'),
                TinyMce::make('Excerpt', 'excerpt')->unescape(),
                TinyMce::make('Description', 'description')->unescape(),
                Image::make('Image', 'image')->disk('public')->dir('store')->removable(),
                Number::make('Price', 'price')->step(0.01),
                Switcher::make('Available', 'is_available')->default(true),
                BelongsToMany::make('Categories', 'categories', 'name', StoreCategoryResource::class)
                    ->searchable(),
            ]),
            Box::make('SEO', [
                Text::make('SEO Title', 'seo_title')->unescape(),
                TinyMce::make('SEO Description', 'seo_description')->unescape(),
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
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('store_products', 'slug')->ignore($id),
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
