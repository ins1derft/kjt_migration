<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Industry;

use Illuminate\Database\Eloquent\Model;
use App\Models\Industry;
use App\MoonShine\Resources\Industry\Pages\IndustryIndexPage;
use App\MoonShine\Resources\Industry\Pages\IndustryFormPage;
use App\MoonShine\Resources\Industry\Pages\IndustryDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Industry, IndustryIndexPage, IndustryFormPage, IndustryDetailPage>
 */
class IndustryResource extends ModelResource
{
    protected string $model = Industry::class;

    protected string $title = 'Industries';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            IndustryIndexPage::class,
            IndustryFormPage::class,
            IndustryDetailPage::class,
        ];
    }
}
