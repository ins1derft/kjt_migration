<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductBadge\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Number;
use App\MoonShine\Resources\ProductBadge\ProductBadgeResource;

/**
 * @extends DetailPage<ProductBadgeResource>
 */
class ProductBadgeDetailPage extends DetailPage
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
