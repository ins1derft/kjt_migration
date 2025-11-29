<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class PageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'type' => $this->type,
            'seo' => $this->seo(),
            'blocks' => $this->normalizedBlocks(),
        ];
    }

    protected function seo(): array
    {
        return [
            'title' => $this->seo_title,
            'description' => $this->seo_description,
            'canonical' => $this->seo_canonical,
            'og_image' => $this->seo_og_image,
        ];
    }

    protected function normalizedBlocks(): array
    {
        $rawBlocks = $this->blocks_array ?? $this->blocks;

        if (empty($rawBlocks)) {
            $raw = $this->getRawOriginal('blocks');
            if (is_string($raw)) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $rawBlocks = $decoded;
                }
            } elseif (is_array($raw)) {
                $rawBlocks = $raw;
            }
        }

        if ($rawBlocks instanceof Collection) {
            $rawBlocks = $rawBlocks->toArray();
        }

        if (!is_array($rawBlocks)) {
            return [];
        }

        return collect($rawBlocks)
            ->map(function ($block, int $index) {
                if ($block instanceof \JsonSerializable) {
                    $block = $block->jsonSerialize();
                }

                if ($block instanceof Collection) {
                    $block = $block->toArray();
                }

                if (is_object($block) && method_exists($block, 'toArray')) {
                    $block = $block->toArray();
                }

                if (!is_array($block)) {
                    return null;
                }

                return [
                    'name' => $block['name'] ?? 'custom',
                    'key' => $block['key'] ?? $index,
                    'values' => $block['values'] ?? [],
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }
}
