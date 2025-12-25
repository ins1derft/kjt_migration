<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $warrantyAttribute = DB::table('product_attributes')
            ->where('code', 'warranty')
            ->first(['id', 'code']);

        $accessoriesAttribute = DB::table('product_attributes')
            ->where('code', 'accessories')
            ->first(['id', 'code', 'type']);

        if (! $warrantyAttribute || ! $accessoriesAttribute) {
            return;
        }

        $warrantyRows = DB::table('product_variant_attribute_values')
            ->where('product_attribute_id', $warrantyAttribute->id)
            ->get(['id', 'product_variant_id', 'value']);

        foreach ($warrantyRows as $row) {
            $decoded = is_string($row->value) ? json_decode($row->value, true) : $row->value;
            $rawValue = $decoded;

            if (is_numeric($rawValue)) {
                $years = (int) round((float) $rawValue);
                $suffix = $years === 1 ? 'year' : 'years';
                $warrantyText = "Warranty: {$years} {$suffix}";
            } else {
                $text = is_string($rawValue) ? trim($rawValue) : trim((string) $rawValue);
                if ($text === '') {
                    DB::table('product_variant_attribute_values')->where('id', $row->id)->delete();
                    continue;
                }
                $warrantyText = "Warranty: {$text}";
            }

            $accessoriesRow = DB::table('product_variant_attribute_values')
                ->where('product_variant_id', $row->product_variant_id)
                ->where('product_attribute_id', $accessoriesAttribute->id)
                ->first(['id', 'value', 'attribute_type', 'position']);

            $items = [];
            if ($accessoriesRow) {
                $decodedAccessories = is_string($accessoriesRow->value) ? json_decode($accessoriesRow->value, true) : $accessoriesRow->value;
                if (is_array($decodedAccessories)) {
                    $items = $decodedAccessories;
                } elseif (is_string($decodedAccessories) && trim($decodedAccessories) !== '') {
                    $items = preg_split('/\r?\n|,\s*/', $decodedAccessories) ?: [];
                }
            }

            $items = array_values(array_filter(array_map(function ($item) {
                if ($item === null) return null;
                $text = trim((string) $item);
                return $text !== '' ? $text : null;
            }, $items)));

            if (! in_array($warrantyText, $items, true)) {
                $items[] = $warrantyText;
            }

            if ($accessoriesRow) {
                DB::table('product_variant_attribute_values')
                    ->where('id', $accessoriesRow->id)
                    ->update([
                        'value' => json_encode($items),
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('product_variant_attribute_values')->insert([
                    'product_variant_id' => $row->product_variant_id,
                    'product_attribute_id' => $accessoriesAttribute->id,
                    'attribute_type' => $accessoriesAttribute->type ?? 'json',
                    'value' => json_encode($items),
                    'position' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('product_variant_attribute_values')->where('id', $row->id)->delete();
        }
    }

    public function down(): void
    {
        // No-op (data migration).
    }
};

