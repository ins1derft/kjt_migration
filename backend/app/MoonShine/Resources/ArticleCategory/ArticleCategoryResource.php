<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ArticleCategory;

use Illuminate\Database\Eloquent\Model;
use App\Models\ArticleCategory;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryIndexPage;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryFormPage;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<ArticleCategory, ArticleCategoryIndexPage, ArticleCategoryFormPage, ArticleCategoryDetailPage>
 */
class ArticleCategoryResource extends ModelResource
{
    protected string $model = ArticleCategory::class;

    protected string $title = 'Article Categories';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ArticleCategoryIndexPage::class,
            ArticleCategoryFormPage::class,
            ArticleCategoryDetailPage::class,
        ];
    }
}
