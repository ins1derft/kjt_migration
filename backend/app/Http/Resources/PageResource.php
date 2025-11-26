<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
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

        if ($rawBlocks instanceof Collection) {
            $rawBlocks = $rawBlocks->toArray();
        }

        if (!is_array($rawBlocks)) {
            return [];
        }

        return collect($rawBlocks)
            ->map(function ($block) {
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

                $layout = $block['layout']
                    ?? $block['alias']
                    ?? $block['name']
                    ?? $block['type']
                    ?? $block['component']
                    ?? null;

                $fields = $block['fields'] ?? Arr::except($block, [
                    'layout',
                    'alias',
                    'name',
                    'type',
                    'component',
                    'id',
                    '_layout',
                    '_type',
                ]);

                if ($fields instanceof Collection) {
                    $fields = $fields->toArray();
                }

                if ($fields instanceof \JsonSerializable) {
                    $fields = $fields->jsonSerialize();
                }

                if (is_object($fields) && method_exists($fields, 'toArray')) {
                    $fields = $fields->toArray();
                }

                if (!is_array($fields)) {
                    $fields = (array) $fields;
                }

                return [
                    'layout' => $layout ?? 'custom',
                    'fields' => $fields,
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }
}
