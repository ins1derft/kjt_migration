<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Lead\Pages;

use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use App\MoonShine\Resources\Lead\LeadResource;
use MoonShine\Support\ListOf;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Json;
use Throwable;
use Illuminate\Support\Collection;
use App\Models\Lead;


/**
 * @extends DetailPage<LeadResource>
 */
class LeadDetailPage extends DetailPage
{
    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Form code', 'form_code'),
            Text::make('Source URL', 'source_url'),
            Json::make('Payload', 'payload', fn (Lead $lead) => $this->toKeyValue($lead->payload ?? []))
                ->keyValue('Field', 'Value'),
            Json::make('UTM', 'utm', fn (Lead $lead) => $this->toKeyValue($lead->utm ?? []))
                ->keyValue('Field', 'Value'),
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

    protected function buttons(): ListOf
    {
        return parent::buttons();
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyDetailComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
