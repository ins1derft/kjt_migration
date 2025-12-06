<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField;

use App\Models\FormFieldOption;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use App\MoonShine\Resources\FormField\Pages\FormFieldOptionFormPage;
use App\MoonShine\Resources\FormField\Pages\FormFieldOptionIndexPage;
use App\MoonShine\Resources\FormField\Pages\FormFieldOptionDetailPage;

/**
 * @extends ModelResource<FormFieldOption, FormFieldOptionIndexPage, FormFieldOptionFormPage, FormFieldOptionDetailPage>
 */
class FormFieldOptionResource extends ModelResource
{
    protected string $model = FormFieldOption::class;

    protected string $title = 'Form field options';

    protected bool $withOnIndex = false;

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            FormFieldOptionIndexPage::class,
            FormFieldOptionFormPage::class,
            FormFieldOptionDetailPage::class,
        ];
    }
}
