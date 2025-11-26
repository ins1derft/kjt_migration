<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Form\Pages;

use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FormBuilderContract;
use MoonShine\UI\Components\FormBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use App\MoonShine\Resources\Form\FormResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Components\Layout\Box;
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
                Json::make('Config', 'config')
                    ->object()
                    ->fields([
                        Text::make('Submit label', 'submit_label')->default('Send'),
                        Text::make('Success message', 'success_message')->default('Спасибо! Мы свяжемся с вами.'),
                        Json::make('Fields', 'fields')
                            ->fields([
                                Text::make('Name', 'name')->required(),
                                Text::make('Label', 'label')->required(),
                                Select::make('Type', 'type')->options([
                                    'text' => 'Text',
                                    'email' => 'Email',
                                    'phone' => 'Phone',
                                    'textarea' => 'Textarea',
                                    'select' => 'Select',
                                    'checkbox' => 'Checkbox',
                                ])->required(),
                                Switcher::make('Required', 'required')->default(true),
                                Text::make('Placeholder', 'placeholder'),
                                Json::make('Options', 'options')
                                    ->keyValue('Value', 'Label')
                                    ->nullable()
                                    ->showWhen('type', 'select'),
                            ])
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
        return [
            'code' => ['required', 'string', 'max:255', 'unique:forms,code,' . ($item->get('id') ?? 'null')],
            'title' => ['required', 'string', 'max:255'],
            'config' => ['nullable', 'array'],
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
