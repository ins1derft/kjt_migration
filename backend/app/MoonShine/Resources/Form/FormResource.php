<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Form;

use Illuminate\Database\Eloquent\Model;
use App\Models\Form;
use App\MoonShine\Resources\Form\Pages\FormIndexPage;
use App\MoonShine\Resources\Form\Pages\FormFormPage;
use App\MoonShine\Resources\Form\Pages\FormDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

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
