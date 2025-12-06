<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariantSpec\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Number;
use App\MoonShine\Resources\ProductVariantSpec\ProductVariantSpecResource;

/**
 * @extends DetailPage<ProductVariantSpecResource>
 */
class ProductVariantSpecDetailPage extends DetailPage
{
    /**
     * @return list<\MoonShine\Contracts\UI\FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Key', 'key'),
            Text::make('Value', 'value'),
            Select::make('Type', 'type')->options([
                'string' => 'String',
                'number' => 'Number',
                'boolean' => 'Boolean',
                'json' => 'JSON',
            ]),
            Number::make('Position', 'position'),
        ];
    }
}
