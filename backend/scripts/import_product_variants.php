#!/usr/bin/env php
<?php

declare(strict_types=1);

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariant;
use Illuminate\Http\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

$options = getopt('', ['json:', 'product-id:']);
$jsonPath = $options['json'] ?? ($argv[1] ?? null);
$productId = isset($options['product-id']) ? (int) $options['product-id'] : (int) ($argv[2] ?? 0);

if (! $jsonPath || $productId <= 0) {
    fwrite(STDERR, "Usage: php scripts/import_product_variants.php --json=path/to/file.json --product-id=NUMBER\n");
    exit(1);
}

$jsonPath = realpath($jsonPath) ?: $jsonPath;

if (! file_exists($jsonPath)) {
    fwrite(STDERR, "JSON file not found: {$jsonPath}\n");
    exit(1);
}

$data = json_decode(file_get_contents($jsonPath), true);
if (! is_array($data)) {
    fwrite(STDERR, "Could not decode JSON file.\n");
    exit(1);
}

$product = Product::find($productId);
if (! $product) {
    fwrite(STDERR, "Product with ID {$productId} not found.\n");
    exit(1);
}

$attributesPayload = $data['attributes'] ?? [];
$variantsPayload = $data['variants'] ?? [];

$tempDir = storage_path('app/tmp/variant-import');
if (! is_dir($tempDir) && ! mkdir($tempDir, 0755, true) && ! is_dir($tempDir)) {
    fwrite(STDERR, "Could not create temp directory: {$tempDir}\n");
    exit(1);
}

DB::transaction(function () use (
    $attributesPayload,
    $variantsPayload,
    $product,
    $tempDir
) {
    $attributeMap = [];

    foreach ($attributesPayload as $attributeData) {
        $code = trim((string) ($attributeData['code'] ?? ''));
        if ($code === '') {
            continue;
        }

        $attribute = ProductAttribute::updateOrCreate(
            ['code' => $code],
            [
                'name' => $attributeData['name'] ?? $code,
                'type' => $attributeData['type'] ?? 'string',
                'position' => $attributeData['position'] ?? 0,
            ]
        );

        $attributeMap[$code] = $attribute->id;
    }

    foreach ($variantsPayload as $variantIndex => $variantData) {
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'name' => $variantData['name'] ?? "variant-{$variantIndex}",
            'price' => $variantData['price'] ?? null,
            'label' => $variantData['label'] ?? null,
            'position' => $variantData['position'] ?? $variantIndex,
        ]);

        $imageUrl = normalizeImageUrl($variantData['image_external_url'] ?? null);
        if ($imageUrl) {
            $storedPath = downloadAndStoreImage($imageUrl, $tempDir, $variant->name ?? "variant-{$variant->id}");
            if ($storedPath) {
                $variant->image = $storedPath;
                $variant->save();
            }
        }

        foreach ($variantData['attributes'] ?? [] as $attributeValue) {
            $code = $attributeValue['code'] ?? null;
            if (! $code || ! isset($attributeMap[$code])) {
                continue;
            }

            $attributeType = $attributeValue['attribute_type'] ?? 'string';
            $preparedValue = prepareAttributeValue($attributeValue['value'] ?? null, $attributeType);

            $insertPayload = [
                'product_variant_id' => $variant->id,
                'product_attribute_id' => $attributeMap[$code],
                'attribute_type' => $attributeType,
                'position' => $attributeValue['position'] ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
                'value' => DB::raw(buildJsonbLiteral($preparedValue)),
            ];

            DB::table('product_variant_attribute_values')->insert($insertPayload);
        }

        echo "Imported variant: {$variant->name} (ID: {$variant->id})\n";
    }
});

function normalizeImageUrl(?string $value): ?string
{
    if ($value === null) {
        return null;
    }

    $trimmed = trim($value);
    if ($trimmed === '') {
        return null;
    }

    if (preg_match('/\((?<url>https?:[^)]+)\)$/', $trimmed, $matches)) {
        return trim($matches['url']);
    }

    if (preg_match('/https?:\/\/[\S]+/i', $trimmed, $matches)) {
        return $matches[0];
    }

    return null;
}

function downloadAndStoreImage(string $url, string $tempDir, string $variantName): ?string
{
    $extension = pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION);
    $extension = $extension ?: 'jpg';

    $tempFile = rtrim($tempDir, DIRECTORY_SEPARATOR).'/'.uniqid('variant-', true).'.'.$extension;

    $response = Http::timeout(60)->sink($tempFile)->get($url);
    if ($response->failed()) {
        @unlink($tempFile);
        fwrite(STDERR, "Failed to download image: {$url}\n");

        return null;
    }

    $baseName = Str::slug($variantName) ?: 'variant';
    $filename = sprintf('%s-%s.%s', $baseName, Str::random(6), $extension);
    $storedPath = Storage::disk('public')->putFileAs('products/variants', new File($tempFile), $filename);

    @unlink($tempFile);

    return $storedPath;
}

function prepareAttributeValue(mixed $value, string $type): mixed
{
    if ($value === null) {
        return null;
    }

    return match ($type) {
        'boolean' => filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE),
        'number' => is_numeric($value) ? $value + 0 : null,
        'json' => normalizeJsonValue($value),
        default => is_scalar($value) || $value === null ? (string) $value : json_encode($value, JSON_UNESCAPED_UNICODE),
    };
}

function normalizeJsonValue(mixed $value): mixed
{
    if (is_array($value)) {
        return $value;
    }

    if (is_object($value)) {
        return json_decode(json_encode($value, JSON_UNESCAPED_UNICODE), true);
    }

    if (is_string($value)) {
        $decoded = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }
    }

    return $value;
}

function buildJsonbLiteral(mixed $value): string
{
    if ($value === null) {
        return 'NULL';
    }

    $encoded = json_encode($value, JSON_UNESCAPED_UNICODE);

    if ($encoded === false) {
        throw new \RuntimeException('Failed to encode attribute value as JSON.');
    }

    return "jsonb '".str_replace("'", "''", $encoded)."'";
}
