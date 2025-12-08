<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductAttribute;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductAttribute;
use App\MoonShine\Resources\ProductAttribute\Pages\ProductAttributeIndexPage;
use App\MoonShine\Resources\ProductAttribute\Pages\ProductAttributeFormPage;
use App\MoonShine\Resources\ProductAttribute\Pages\ProductAttributeDetailPage;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<ProductAttribute, ProductAttributeIndexPage, ProductAttributeFormPage, ProductAttributeDetailPage>
 */
class ProductAttributeResource extends ModelResource
{
    protected string $model = ProductAttribute::class;

    protected string $title = 'Product Attributes';

    protected string $column = 'name';

    protected array $with = ['values'];

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            ProductAttributeIndexPage::class,
            ProductAttributeFormPage::class,
            ProductAttributeDetailPage::class,
        ];
    }
}
