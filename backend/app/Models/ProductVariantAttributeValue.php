<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductAttribute;

class ProductVariantAttributeValue extends Model
{
    protected $guarded = [];

    protected $casts = [
        'value' => 'json',
        'position' => 'integer',
        'attribute_type' => 'string',
    ];

    protected $appends = [
        'attribute_type',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $model) {
            $model->attributes['attribute_type'] = $model->resolveAttributeType();
        });
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function attribute()
    {
        return $this->belongsTo(ProductAttribute::class, 'product_attribute_id');
    }

    public function getAttributeTypeAttribute(): ?string
    {
        return $this->resolveAttributeType() ?? ($this->attributes['attribute_type'] ?? null);
    }

    public function getValueStringAttribute(): ?string
    {
        $val = $this->value;

        if (is_scalar($val) || $val === null) {
            return $val === null ? null : (string) $val;
        }

        return null;
    }

    public function setValueStringAttribute($value): void
    {
        $this->setValueAttribute($value === '' ? null : $value, 'string');
    }

    public function getValueNumberAttribute(): ?float
    {
        return is_numeric($this->value) ? $this->value + 0 : null;
    }

    public function setValueNumberAttribute($value): void
    {
        $this->setValueAttribute($value, 'number');
    }

    public function getValueBooleanAttribute(): ?bool
    {
        return is_bool($this->value) ? $this->value : null;
    }

    public function setValueBooleanAttribute($value): void
    {
        $this->setValueAttribute($value, 'boolean');
    }

    public function getValueJsonAttribute(): array
    {
        if (!is_array($this->value)) {
            return [];
        }

        return collect($this->value)
            ->map(function ($val, $key) {
                return [
                    'key' => (string) $key,
                    'value' => is_scalar($val) || $val === null
                        ? (string) $val
                        : json_encode($val, JSON_UNESCAPED_UNICODE),
                ];
            })
            ->values()
            ->toArray();
    }

    public function setValueJsonAttribute($rows): void
    {
        $this->setValueAttribute($rows, 'json');
    }

    public function setValueAttribute($value, ?string $explicitType = null): void
    {
        $type = $explicitType
            ?? ($this->attributes['attribute_type'] ?? null)
            ?? $this->resolveAttributeType();

        switch ($type) {
            case 'string':
                $this->attributes['value'] = $value === null
                    ? null
                    : json_encode((string) $value, JSON_UNESCAPED_UNICODE);
                break;
            case 'number':
                $this->attributes['value'] = is_numeric($value) ? $value + 0 : null;
                break;
            case 'boolean':
                $bool = filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);
                $this->attributes['value'] = $bool;
                break;
            case 'json':
                $this->attributes['value'] = $this->normalizeJsonRows($value);
                break;
            default:
                // Если тип ещё не определён, всё равно пишем валидный JSON
                $this->attributes['value'] = json_encode($value, JSON_UNESCAPED_UNICODE);
        }
    }

    private function normalizeJsonRows($rows): ?array
    {
        if (!is_array($rows)) {
            return null;
        }

        return collect($rows)
            ->filter(fn ($row) => is_array($row) && ($row['key'] ?? '') !== '')
            ->mapWithKeys(function ($row) {
                $key = $row['key'];
                $val = $row['value'] ?? null;

                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        return [$key => $decoded];
                    }
                }

                return [$key => $val];
            })
            ->toArray();
    }

    public function typedValue(): mixed
    {
        return match ($this->getAttributeTypeAttribute()) {
            'boolean' => filter_var($this->value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE),
            'number' => is_numeric($this->value) ? $this->value + 0 : null,
            'json' => $this->value,
            default => $this->getValueStringAttribute(),
        };
    }

    private function resolveAttributeType(): ?string
    {
        return $this->attribute?->type
            ?? ($this->product_attribute_id
                ? ProductAttribute::query()->whereKey($this->product_attribute_id)->value('type')
                : null);
    }
}
