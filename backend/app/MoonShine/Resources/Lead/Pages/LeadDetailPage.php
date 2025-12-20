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
use MoonShine\UI\Fields\Date;
use MoonShine\Laravel\Fields\Relationships\BelongsTo;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use Throwable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use App\Models\Lead;
use MoonShine\UI\Components\Files;
use MoonShine\UI\Components\Thumbnails;
use MoonShine\UI\Components\Layout\Div;


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
            Text::make('Topic', 'topic'),
            BelongsTo::make('Variant', 'productVariant', 'name', ProductVariantResource::class)
                ->nullable(),
            Text::make('Source URL', 'source_url'),
            Date::make('Submitted at', 'submitted_at')->format('Y-m-d H:i'),
            Json::make('Payload', 'payload', fn (Lead $lead) => $this->toKeyValue($lead->payload ?? []))
                ->keyValue('Field', 'Value', null, $this->payloadValueField()),
            Json::make('UTM', 'utm', fn (Lead $lead) => $this->toKeyValue($lead->utm ?? []))
                ->keyValue('Field', 'Value'),
        ];
    }

    protected function payloadValueField(): FieldContract
    {
        return Text::make('Value', 'value')
            ->changePreview(fn ($value) => $this->renderPayloadValue($value))
            ->unescape();
    }

    protected function renderPayloadValue(mixed $value): string
    {
        if ($this->isFilePayload($value)) {
            return $this->renderFileComponent($value)->render();
        }

        if ($this->isFilePayloadList($value)) {
            $components = array_map(
                fn (array $file) => $this->renderFileComponent($file),
                $value
            );

            return Div::make($components)
                ->customAttributes(['class' => 'flex flex-col gap-2'])
                ->render();
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_scalar($value) || is_null($value)) {
            return (string) $value;
        }

        return (string) json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Normalize associative arrays to [{ key, value }] for keyValue tables.
     */
    protected function toKeyValue(mixed $value): array
    {
        return Collection::make($value ?? [])
            ->map(fn ($item, $key) => [
                'key' => (string) $key,
                'value' => $this->normalizePayloadValue($item),
            ])
            ->values()
            ->all();
    }

    protected function normalizePayloadValue(mixed $value): mixed
    {
        if ($this->isFilePayload($value) || $this->isFilePayloadList($value)) {
            return $value;
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_scalar($value) || is_null($value)) {
            return (string) $value;
        }

        return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    protected function isFilePayload(mixed $value): bool
    {
        return is_array($value)
            && isset($value['path'])
            && (isset($value['mime_type']) || isset($value['original_name']));
    }

    protected function isFilePayloadList(mixed $value): bool
    {
        if (! is_array($value) || ! array_is_list($value) || $value === []) {
            return false;
        }

        foreach ($value as $item) {
            if (! $this->isFilePayload($item)) {
                return false;
            }
        }

        return true;
    }

    protected function renderFileComponent(array $file): ComponentContract
    {
        $url = $this->resolveFileUrl($file['path'] ?? null);

        if ($url && $this->isImageMime($file['mime_type'] ?? null)) {
            return Thumbnails::make($url);
        }

        return Files::make([
            [
                'full_path' => $url ?? '',
                'raw_value' => $url ?? '',
                'name' => (string) ($file['original_name'] ?? $file['path'] ?? 'Download'),
            ],
        ]);
    }

    protected function resolveFileUrl(?string $path): ?string
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        if (
            str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://')
            || str_starts_with($path, '/')
        ) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    protected function isImageMime(?string $mime): bool
    {
        return is_string($mime) && $mime !== '' && str_starts_with($mime, 'image/');
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
