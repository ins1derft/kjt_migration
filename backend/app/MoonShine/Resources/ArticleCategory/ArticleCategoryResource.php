<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ArticleCategory;

use App\Models\ArticleCategory;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryIndexPage;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryFormPage;
use App\MoonShine\Resources\ArticleCategory\Pages\ArticleCategoryDetailPage;

use Leeto\MoonShineTree\Resources\TreeResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends TreeResource<ArticleCategory, ArticleCategoryIndexPage, ArticleCategoryFormPage, ArticleCategoryDetailPage>
 */
class ArticleCategoryResource extends TreeResource
{
    protected string $model = ArticleCategory::class;

    protected string $title = 'Article Categories';

    protected string $column = 'name';

    protected string $sortColumn = 'position';
    
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

    public function treeKey(): ?string
    {
        return 'parent_id';
    }

    public function sortKey(): string
    {
        return $this->sortColumn;
    }
}
