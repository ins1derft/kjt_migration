<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductBadge\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Image;
use App\MoonShine\Resources\ProductBadge\ProductBadgeResource;

/**
 * @extends IndexPage<ProductBadgeResource>
 */
class ProductBadgeIndexPage extends IndexPage
{
    /**
     * @return list<\MoonShine\Contracts\UI\FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Image', 'image')->disk('public')->dir('products/badges'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}
