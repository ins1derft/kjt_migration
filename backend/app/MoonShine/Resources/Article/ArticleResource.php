<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Article;

use Illuminate\Database\Eloquent\Model;
use App\Models\Article;
use App\MoonShine\Resources\Article\Pages\ArticleIndexPage;
use App\MoonShine\Resources\Article\Pages\ArticleFormPage;
use App\MoonShine\Resources\Article\Pages\ArticleDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<Article, ArticleIndexPage, ArticleFormPage, ArticleDetailPage>
 */
class ArticleResource extends ModelResource
{
    protected string $model = Article::class;

    protected string $title = 'Articles';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ArticleIndexPage::class,
            ArticleFormPage::class,
            ArticleDetailPage::class,
        ];
    }
}
