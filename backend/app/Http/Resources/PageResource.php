<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class PageResource extends JsonResource
{
    use FormatsMediaUrls;

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
            'product' => $this->when($this->shouldIncludeProduct(), $this->productSummary()),
            'variants' => $this->when($this->shouldIncludeProduct(), $this->productVariants()),
            'games' => $this->when($this->shouldIncludeProduct(), $this->productGames()),
            'blocks' => $this->normalizedBlocks(),
        ];
    }

    protected function seo(): array
    {
        return [
            'title' => $this->seo_title,
            'description' => $this->seo_description,
            'canonical' => $this->seo_canonical,
            'og_image' => $this->mediaUrl($this->seo_og_image),
        ];
    }

    protected function shouldIncludeProduct(): bool
    {
        return $this->type === 'product_landing' && $this->product;
    }

    protected function productSummary(): array
    {
        if (!$this->product) {
            return [];
        }

        return [
            'id' => $this->product->id,
            'slug' => $this->product->slug,
            'name' => $this->product->name,
            'subtitle' => $this->product->subtitle,
            'excerpt' => $this->product->excerpt,
            'description' => $this->product->description,
            'hero_image' => $this->mediaUrl($this->product->hero_image),
            'default_cta_label' => $this->product->default_cta_label,
            'seo' => [
                'title' => $this->product->seo_title,
                'description' => $this->product->seo_description,
                'canonical' => $this->product->seo_canonical,
                'og_image' => $this->mediaUrl($this->product->seo_og_image),
            ],
        ];
    }

    protected function productVariants(): array
    {
        if (!$this->product || !$this->product->relationLoaded('variants')) {
            return [];
        }

        return $this->product->variants
            ->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'name' => $variant->name,
                    'label' => $variant->label,
                    'price' => $variant->price,
                    'specs' => $variant->specs,
                    'position' => $variant->position,
                ];
            })
            ->values()
            ->toArray();
    }

    protected function productGames(): array
    {
        if (!$this->product || !$this->product->relationLoaded('games')) {
            return [];
        }

        return $this->product->games
            ->map(function ($game) {
                return [
                    'slug' => $game->slug,
                    'title' => $game->title,
                    'excerpt' => $game->excerpt,
                    'hero_image' => $this->mediaUrl($game->hero_image),
                    'genre' => $game->genre,
                    'target_age' => $game->target_age,
                ];
            })
            ->values()
            ->toArray();
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
