<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use App\Http\Resources\Concerns\FormatsMediaUrls;
use App\Http\Resources\Concerns\FiltersFields;

class PageResource extends JsonResource
{
    use FormatsMediaUrls;
    use FiltersFields;

    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        $data = [
            'slug' => $this->slug,
            'title' => $this->title,
            'type' => $this->type,
            'seo' => $this->seo(),
            'product' => $this->when($this->shouldIncludeProduct(), $this->productSummary()),
            'variants' => $this->when($this->shouldIncludeProduct(), $this->productVariants()),
            'games' => $this->when($this->shouldIncludeProduct(), $this->productGames()),
            'blocks' => $this->normalizedBlocks(),
        ];

        return $this->filterFields($data, $request);
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
            'slogan' => $this->product->slogan,
            'excerpt' => $this->product->excerpt,
            'description' => $this->product->description,
            'hero_image' => $this->mediaUrl($this->product->hero_image),
            'default_cta_label' => $this->product->default_cta_label,
            'rating' => $this->product->rating,
            'review_count_label' => $this->product->review_count_label,
            'badges' => $this->product->badges,
            'form' => $this->product->form ? [
                'id' => $this->product->form->id,
                'code' => $this->product->form->code,
                'title' => $this->product->form->title,
                'topic' => $this->product->form->topic,
            ] : null,
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
                    'image' => $this->mediaUrl($variant->image),
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

                $normalized = [
                    'name' => $block['name'] ?? 'custom',
                    'key' => $block['key'] ?? $index,
                    'values' => $block['values'] ?? [],
                ];

                return $this->normalizeInteractiveShowcaseBlock($normalized);
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function normalizeInteractiveShowcaseBlock(array $block): array
    {
        if (($block['name'] ?? null) !== 'interactive_header') {
            return $block;
        }

        $values = $block['values'] ?? [];
        $items = $values['items'] ?? [];

        $values['items'] = collect($items)
            ->map(function ($item) {
                if (!is_array($item)) {
                    return $item;
                }

                $features = $item['features'] ?? [];

                $item['features'] = collect($features)
                    ->map(function ($feature) {
                        if (!is_array($feature)) {
                            return $feature;
                        }

                        $icons = collect([
                            $feature['icon1'] ?? null,
                            $feature['icon2'] ?? null,
                            $feature['icon3'] ?? null,
                        ])
                            ->merge($feature['icons'] ?? [])
                            ->filter(fn ($icon) => is_string($icon) && $icon !== '')
                            ->unique()
                            ->values()
                            ->all();

                        return array_merge($feature, [
                            'icons' => $icons,
                        ]);
                    })
                    ->toArray();

                return $item;
            })
            ->toArray();

        $block['values'] = $values;

        return $block;
    }
}
