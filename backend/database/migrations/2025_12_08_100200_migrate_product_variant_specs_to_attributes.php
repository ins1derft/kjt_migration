<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            $existingCodes = DB::table('product_attributes')->pluck('id', 'code')->all();
            $codeCounters = [];

            $variants = DB::table('product_variants')->select('id', 'specs')->get();

            foreach ($variants as $variant) {
                if (empty($variant->specs)) {
                    continue;
                }

                $specs = $variant->specs;

                if (is_string($specs)) {
                    $decoded = json_decode($specs, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $specs = $decoded;
                    }
                }

                if (!is_array($specs)) {
                    continue;
                }

                $position = 0;

                foreach ($specs as $key => $value) {
                    if ($key === '') {
                        continue;
                    }

                    $type = $this->detectType($value);

                    $baseCode = Str::slug((string) $key, '_') ?: 'attribute';
                    $code = $baseCode;

                    if (isset($existingCodes[$code])) {
                        $codeCounters[$baseCode] = ($codeCounters[$baseCode] ?? 0) + 1;
                        $code = $baseCode . '_' . $codeCounters[$baseCode];
                    }

                    if (!isset($existingCodes[$code])) {
                        $attrId = DB::table('product_attributes')->insertGetId([
                            'name' => (string) $key,
                            'code' => $code,
                            'type' => $type,
                            'position' => 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $existingCodes[$code] = $attrId;
                    }

                    $attributeId = $existingCodes[$code];

                    // Keep attribute_type in sync with the attribute.
                    $attributeType = DB::table('product_attributes')->where('id', $attributeId)->value('type') ?? $type;

                    $normalizedValue = $this->normalizeValue($value, $attributeType);
                    $jsonValue = $this->encodeJsonValue($normalizedValue);

                    DB::table('product_variant_attribute_values')->updateOrInsert(
                        [
                            'product_variant_id' => $variant->id,
                            'product_attribute_id' => $attributeId,
                        ],
                        [
                            'attribute_type' => $attributeType,
                            'value' => DB::raw("'" . str_replace("'", "''", $jsonValue) . "'::jsonb"),
                            'position' => $position,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    $position++;
                }
            }
        });

        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'specs')) {
                $table->dropColumn('specs');
            }
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'specs')) {
                $table->jsonb('specs')->nullable();
            }
        });

        // Best-effort rollback: repopulate specs from attribute values
        DB::transaction(function () {
            $variants = DB::table('product_variants')->select('id')->get();

            foreach ($variants as $variant) {
                $values = DB::table('product_variant_attribute_values as v')
                    ->join('product_attributes as a', 'a.id', '=', 'v.product_attribute_id')
                    ->where('v.product_variant_id', $variant->id)
                    ->orderBy('v.position')
                    ->get([
                        'a.code',
                        'a.name',
                        'a.type',
                        'v.value',
                    ]);

                $specs = [];

                foreach ($values as $row) {
                    $key = $row->code ?: $row->name;
                    $specs[$key] = $this->normalizeValue(json_decode(json_encode($row->value), true), $row->type);
                }

                DB::table('product_variants')
                    ->where('id', $variant->id)
                    ->update(['specs' => $specs]);
            }
        });

        Schema::dropIfExists('product_variant_attribute_values');
        Schema::dropIfExists('product_attributes');
    }

    private function detectType(mixed $value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        }

        if (is_numeric($value)) {
            return 'number';
        }

        if (is_array($value) || is_object($value)) {
            return 'json';
        }

        return 'string';
    }

    private function normalizeValue(mixed $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE),
            'number' => is_numeric($value) ? $value + 0 : null,
            'json' => $this->normalizeJsonValue($value),
            default => is_scalar($value) || $value === null
                ? (string) $value
                : json_encode($value, JSON_UNESCAPED_UNICODE),
        };
    }

    private function encodeJsonValue(mixed $value): string
    {
        return json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    private function normalizeJsonValue(mixed $value): mixed
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        if (is_array($value) || is_object($value)) {
            return json_decode(json_encode($value), true);
        }

        return $value;
    }
};
