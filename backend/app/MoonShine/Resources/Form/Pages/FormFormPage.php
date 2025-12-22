<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Form\Pages;

use App\MoonShine\Resources\Form\FormResource;
use Illuminate\Validation\Rule;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Support\ListOf;
use MoonShine\TinyMce\Fields\TinyMce;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends FormPage<FormResource>
 */
class FormFormPage extends FormPage
{
    /**
     * @return list<ComponentContract|FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            Box::make([
                ID::make(),
                Text::make('Code', 'code')->required(),
                Text::make('Title', 'title')->required(),
                Text::make('Topic', 'topic'),
                Json::make('Config', 'config')
                    ->object()
                    ->fields([
                        Text::make('Submit label', 'submit_label')->default('Send'),
                        Text::make('Success message', 'success_message')->default('Thanks! We will contact you soon.'),
                        TinyMce::make('Disclaimer', 'disclaimer')->nullable()->unescape(),
                        Json::make('Fields', 'fields')
                            ->fields([
                                Text::make('Name', 'name')->required(),
                                Text::make('Label', 'label')->required(),
                                Select::make('Type', 'type')->options([
                                    'text' => 'Text',
                                    'email' => 'Email',
                                    'phone' => 'Phone',
                                    'date' => 'Date',
                                    'file' => 'File',
                                    'textarea' => 'Textarea',
                                    'select' => 'Select',
                                    'checkbox' => 'Checkbox',
                                    'radio' => 'Radio',
                                ])->required(),
                                Switcher::make('Required', 'required')->default(true),
                                Text::make('Placeholder', 'placeholder'),
                                Json::make('Options', 'options')
                                    ->keyValue('Value', 'Label')
                                    ->creatable()
                                    ->removable()
                                    ->nullable()
                                    ->showWhen('type', 'in', ['select', 'checkbox', 'radio']),
                            ])
                            ->vertical()
                            ->creatable()
                            ->removable()
                            ->nullable(),
                        Json::make('Steps', 'steps')
                            ->fields([
                                Text::make('Title', 'title')->nullable()->unescape(),
                                Text::make('Next label', 'next_label')->nullable()->unescape(),
                                Text::make('Previous label', 'prev_label')->nullable()->unescape(),
                                Json::make('Fields', 'fields')
                                    ->fields([
                                        Text::make('Name', 'name')->required(),
                                        Text::make('Label', 'label')->required(),
                                        Select::make('Type', 'type')->options([
                                            'text' => 'Text',
                                            'email' => 'Email',
                                            'phone' => 'Phone',
                                            'date' => 'Date',
                                            'file' => 'File',
                                            'textarea' => 'Textarea',
                                            'select' => 'Select',
                                            'checkbox' => 'Checkbox',
                                            'radio' => 'Radio',
                                        ])->required(),
                                        Switcher::make('Required', 'required')->default(true),
                                        Text::make('Placeholder', 'placeholder'),
                                        Json::make('Options', 'options')
                                            ->keyValue('Value', 'Label')
                                            ->creatable()
                                            ->removable()
                                            ->nullable()
                                            ->showWhen('type', 'in', ['select', 'checkbox', 'radio']),
                                    ])
                                    ->vertical()
                                    ->creatable()
                                    ->removable()
                                    ->nullable(),
                            ])
                            ->vertical()
                            ->creatable()
                            ->removable()
                            ->nullable(),
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
        $id = $this->getResource()->getItem()?->getKey() ?? request()->route('resourceItem');

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('forms', 'code')->ignore($id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'topic' => ['nullable', 'string', 'max:255'],
            'config' => ['nullable', 'array'],
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
