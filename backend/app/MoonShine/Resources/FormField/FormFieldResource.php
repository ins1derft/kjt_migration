<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\FormField;

use App\Models\FormField;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use App\MoonShine\Resources\FormField\Pages\FormFieldIndexPage;
use App\MoonShine\Resources\FormField\Pages\FormFieldFormPage;
use App\MoonShine\Resources\FormField\Pages\FormFieldDetailPage;

/**
 * @extends ModelResource<FormField, FormFieldIndexPage, FormFieldFormPage, FormFieldDetailPage>
 */
class FormFieldResource extends ModelResource
{
    protected string $model = FormField::class;

    protected string $title = 'Form fields';

    protected bool $withOnIndex = false;

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            FormFieldIndexPage::class,
            FormFieldFormPage::class,
            FormFieldDetailPage::class,
        ];
    }
}
