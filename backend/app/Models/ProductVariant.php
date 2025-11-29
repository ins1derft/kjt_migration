<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $guarded = [];

    protected $appends = [
        'specs_json',
        'specs_table',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
        ];
    }

    public function getSpecsJsonAttribute(): ?string
    {
        $specs = $this->specs;

        if (is_array($specs)) {
            return json_encode($specs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        return $specs ? (string) $specs : null;
    }

    public function setSpecsJsonAttribute($value): void
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->specs = $decoded;
                return;
            }
        }

        $this->specs = $value ?: null;
    }

    public function getSpecsTableAttribute(): array
    {
        if (!is_array($this->specs)) {
            return [];
        }

        return collect($this->specs)->map(function ($val, $key) {
            $type = 'string';
            $outVal = $val;

            if (is_bool($val)) {
                $type = 'boolean';
                $outVal = $val ? 'true' : 'false';
            } elseif (is_numeric($val)) {
                $type = 'number';
                $outVal = (string) $val;
            } elseif (is_array($val) || is_object($val)) {
                $type = 'json';
                $outVal = json_encode($val, JSON_UNESCAPED_UNICODE);
            }

            return [
                'key' => $key,
                'value' => $outVal,
                'type' => $type,
            ];
        })->values()->toArray();
    }

    public function setSpecsTableAttribute($rows): void
    {
        if (!is_array($rows)) {
            $this->specs = null;
            return;
        }

        $this->specs = collect($rows)
            ->filter(fn ($row) => is_array($row) && ($row['key'] ?? '') !== '')
            ->mapWithKeys(function ($row) {
                $key = $row['key'];
                $type = $row['type'] ?? 'string';
                $value = $row['value'] ?? null;

                if ($type === 'number') {
                    $num = is_numeric($value) ? $value + 0 : null;
                    return [$key => $num];
                }

                if ($type === 'boolean') {
                    return [$key => filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE)];
                }

                if ($type === 'json') {
                    if (is_string($value)) {
                        $decoded = json_decode($value, true);
                        if (json_last_error() === JSON_ERROR_NONE) {
                            return [$key => $decoded];
                        }
                    }
                    return [$key => $value];
                }

                return [$key => $value];
            })
            ->toArray();
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
