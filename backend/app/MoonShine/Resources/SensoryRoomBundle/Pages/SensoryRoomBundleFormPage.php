<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SensoryRoomBundle\Pages;

use App\Models\Form;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\SensoryRoomBundle\SensoryRoomBundleResource;
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
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Textarea;
use Throwable;

/**
 * @extends FormPage<SensoryRoomBundleResource>
 */
class SensoryRoomBundleFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make('Sensory Room bundle', [
                ID::make(),
                Text::make('Title', 'title')
                    ->required()
                    ->unescape()
                    ->reactive(debounce: 300),
                Slug::make('Slug', 'slug')
                    ->from('title')
                    ->live()
                    ->locale('ru'),
                TinyMce::make('Excerpt', 'excerpt')->unescape()->nullable(),
                Json::make('Gallery', 'gallery')->fields([
                    Image::make('Image', 'src')
                        ->disk('public')
                        ->dir('sensory-room/bundles/gallery')
                        ->removable(),
                    Text::make('Alt', 'alt')->unescape(),
                ])->vertical()->creatable()->removable()->nullable(),
                Json::make('Specs', 'specs')->fields([
                    Text::make('Value', 'value')->required()->unescape(),
                ])->vertical()->creatable()->removable()->nullable(),
                Select::make('Form', 'form_code')
                    ->options(fn () => Form::orderBy('title')->pluck('title', 'code')->toArray())
                    ->nullable()
                    ->searchable()
                    ->hint('Optional: form code to open in QuoteModal from the list cards'),
                Text::make('Custom bundle URL', 'custom_bundle_url')
                    ->nullable()
                    ->hint('Optional: override URL for the "Custom Bundle" button (absolute or relative)'),
                Select::make('Status', 'status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                    ])
                    ->default('draft')
                    ->required(),
                Number::make('Position', 'position')->default(0),
                BelongsToMany::make('Products', 'products', 'name', ProductResource::class)
                    ->searchable(),
            ]),
            Box::make('Detail page (Block A)', [
                Text::make('Block A title', 'block_a_title')->unescape()->nullable(),
                Json::make('Block A items', 'block_a_items')->fields([
                    Image::make('Icon', 'icon')
                        ->disk('public')
                        ->dir('sensory-room/bundles/block-a/icons')
                        ->removable(),
                    TinyMce::make('Text', 'text')->required()->unescape(),
                ])->vertical()->creatable()->removable()->nullable(),
            ]),
            Box::make('Detail page (Block B)', [
                Text::make('Block B title', 'block_b_title')->unescape()->nullable(),
                TinyMce::make('Block B text', 'block_b_text')->unescape()->nullable(),
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
                Rule::unique('sensory_room_bundles', 'slug')->ignore($id),
            ],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'position' => ['nullable', 'integer'],
            'form_code' => ['nullable', 'string', 'max:255'],
            'custom_bundle_url' => ['nullable', 'string', 'max:2048'],
            'excerpt' => ['nullable', 'string'],
            'gallery' => ['nullable', 'array'],
            'specs' => ['nullable', 'array'],
            'block_a_title' => ['nullable', 'string', 'max:255'],
            'block_a_items' => ['nullable', 'array'],
            'block_b_title' => ['nullable', 'string', 'max:255'],
            'block_b_text' => ['nullable', 'string'],
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
