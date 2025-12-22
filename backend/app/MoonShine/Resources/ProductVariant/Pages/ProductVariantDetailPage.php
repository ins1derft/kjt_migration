<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\ProductVariant\Pages;

use App\Models\ProductVariant;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use Illuminate\Support\Collection;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Support\ListOf;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Fields\Preview;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;
use Throwable;

/**
 * @extends DetailPage<ProductVariantResource>
 */
class ProductVariantDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            BelongsTo::make('Product', 'product', 'name', ProductResource::class),
            Text::make('Name', 'name'),
            Image::make('Image', 'image')
                ->disk('public')
                ->dir('products/variants')
                ->removable(),
            Number::make('Price', 'price'),
            Text::make('Label', 'label'),
            Switcher::make('Highlight in Compare Table', 'is_highlighted')->readonly(),
            Preview::make('Specs', null, fn (ProductVariant $variant) => $this->renderKeyValue($variant->specs ?? [])),
            Number::make('Position', 'position'),
        ];
    }

    /**
     * Normalize associative arrays to [{ key, value }] for keyValue tables.
     */
    protected function toKeyValue(mixed $value): array
    {
        return Collection::make($value ?? [])
            ->map(fn ($item, $key) => [
                'key' => (string) $key,
                'value' => is_scalar($item) || is_null($item)
                    ? (string) $item
                    : json_encode($item, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ])
            ->values()
            ->all();
    }

    protected function renderKeyValue(mixed $value): string
    {
        $rows = Collection::make($this->toKeyValue($value))
            ->map(fn ($pair) => sprintf(
                '<tr><td class="font-semibold text-sm">%s</td><td class="text-sm">%s</td></tr>',
                e($pair['key']),
                e($pair['value'])
            ))
            ->implode('');

        return sprintf('<table class="table table-divider"><tbody>%s</tbody></table>', $rows ?: '<tr><td colspan="2" class="text-sm text-muted">—</td></tr>');
    }

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer(),
        ];
    }

    /**
     * @return list<ComponentContract>
     *
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer(),
        ];
    }
}
