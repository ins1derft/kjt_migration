<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Form\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Form\FormResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Switcher;
use Throwable;


/**
 * @extends DetailPage<FormResource>
 */
class FormDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Code', 'code'),
            Text::make('Title', 'title'),
            Json::make('Config', 'config')
                ->object()
                ->fields([
                    Text::make('Submit label', 'submit_label'),
                    Text::make('Success message', 'success_message'),
                    Json::make('Fields', 'fields')
                        ->fields([
                            Text::make('Name', 'name'),
                            Text::make('Label', 'label'),
                            Select::make('Type', 'type')->options([
                                'text' => 'Text',
                                'email' => 'Email',
                                'phone' => 'Phone',
                                'textarea' => 'Textarea',
                                'select' => 'Select',
                                'checkbox' => 'Checkbox',
                            ]),
                            Switcher::make('Required', 'required'),
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
        ];
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
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
