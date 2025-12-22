<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Form;

use App\Models\Form;
use App\MoonShine\Resources\Form\Pages\FormDetailPage;
use App\MoonShine\Resources\Form\Pages\FormFormPage;
use App\MoonShine\Resources\Form\Pages\FormIndexPage;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Resources\ModelResource;

/**
 * @extends ModelResource<Form, FormIndexPage, FormFormPage, FormDetailPage>
 */
class FormResource extends ModelResource
{
    protected string $model = Form::class;

    protected string $title = 'Forms';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            FormIndexPage::class,
            FormFormPage::class,
            FormDetailPage::class,
        ];
    }
}
