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
                Text::make('Name', 'name')->required(),
                Slug::make('Slug', 'slug')->from('name'),
                Text::make('Subtitle', 'subtitle'),
                Textarea::make('Excerpt', 'excerpt'),
                Textarea::make('Description', 'description'),
                Image::make('Hero image', 'hero_image')->disk('public')->dir('products')->removable(),
                Text::make('Product type', 'product_type'),
                Text::make('Default CTA label', 'default_cta_label'),
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
