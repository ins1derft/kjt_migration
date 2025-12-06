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

        $badges = $this->product->relationLoaded('badges')
            ? $this->product->badges
            : collect();

        if (!$badges instanceof \Illuminate\Support\Collection) {
            $badges = collect();
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
            'badges' => $badges
                ->map(function ($badge) {
                    return [
                        'image' => $this->mediaUrl($badge->image),
                        'label' => $badge->label,
                        'position' => $badge->position,
                    ];
                })
                ->values(),
            'form' => $this->product->form ? [
                'id' => $this->product->form->id,
                'code' => $this->product->form->code,
                'title' => $this->product->form->title,
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
                    'specs' => $variant->relationLoaded('specRows')
                        ? $variant->specRows->map(function ($spec) {
                            return [
                                'key' => $spec->key,
                                'value' => $spec->value,
                                'type' => $spec->type,
                                'position' => $spec->position,
                            ];
                        })->values()
                        : [],
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
        $blocks = $this->normalizeRawBlocks();

        $relations = [
            'hero' => $this->groupByBlockIndex($this->heroSlides ?? collect(), fn ($slide) => [
                'videoId' => $slide->video_id,
                'alt' => $slide->alt,
                'position' => $slide->position,
            ]),
            'hero_values' => $this->groupByBlockIndex($this->heroValueItems ?? collect(), fn ($item) => [
                'title' => $item->title,
                'description' => $item->description,
                'icon' => $this->mediaUrl($item->icon),
                'position' => $item->position,
            ]),
            'product_nav' => $this->groupByBlockIndex($this->productNavItems ?? collect(), fn ($item) => [
                'label' => $item->label,
                'anchor' => $item->anchor,
                'position' => $item->position,
            ]),
            'interactive_header' => $this->groupByBlockIndex($this->interactiveShowcaseItems ?? collect(), function ($item) {
                $features = ($item->features ?? collect())
                    ->sortBy(fn ($feature) => [$feature->position, $feature->id])
                    ->values()
                    ->map(fn ($feature) => [
                        'icon' => $this->mediaUrl($feature->icon),
                        'label' => $feature->label,
                        'position' => $feature->position,
                    ])->toArray();

                $gallery = ($item->gallery ?? collect())
                    ->sortBy(fn ($media) => [$media->position, $media->id])
                    ->values()
                    ->map(fn ($media) => [
                        'src' => $this->mediaUrl($media->src),
                        'alt' => $media->alt,
                        'position' => $media->position,
                    ])->toArray();

                return [
                    'title' => $item->title,
                    'productPageSlug' => $item->product_page_slug,
                    'description' => $item->description,
                    'hashtag' => $item->hashtag,
                    'features' => $features,
                    'ctaLabel' => $item->cta_label,
                    'ctaHref' => $item->cta_href,
                    'formCode' => $item->form_code,
                    'gallery' => $gallery,
                    'videoId' => $item->video_id,
                    'videoPoster' => $this->mediaUrl($item->video_poster),
                    'videoAlt' => $item->video_alt,
                    'position' => $item->position,
                ];
            }),
            'product_hero' => $this->groupByBlockIndex($this->productHeroBadges ?? collect(), fn ($badge) => [
                'image' => $this->mediaUrl($badge->image),
                'label' => $badge->label,
                'position' => $badge->position,
            ]),
            'product_specs' => $this->groupByBlockIndex($this->productSpecTabs ?? collect(), fn ($tab) => [
                'key' => $tab->key,
                'label' => $tab->label,
                'image' => $this->mediaUrl($tab->image),
                'title' => $tab->title,
                'description' => $tab->description,
                'position' => $tab->position,
            ]),
            'feature_grid' => $this->groupByBlockIndex($this->featureGridItems ?? collect(), fn ($item) => [
                'title' => $item->title,
                'description' => $item->description,
                'icon' => $this->mediaUrl($item->icon),
                'position' => $item->position,
            ]),
            'product_carousel' => $this->groupByBlockIndex($this->productCarouselFilters ?? collect(), fn ($filter) => [
                'field' => $filter->field,
                'value' => $filter->value,
                'position' => $filter->position,
            ]),
            'games_gallery' => $this->groupByBlockIndex($this->gamesGalleryFilters ?? collect(), fn ($filter) => [
                'field' => $filter->field,
                'value' => $filter->value,
                'position' => $filter->position,
            ]),
            'games_grid' => $this->groupByBlockIndex($this->gamesGridFilters ?? collect(), fn ($filter) => [
                'field' => $filter->field,
                'value' => $filter->value,
                'position' => $filter->position,
            ]),
            'news' => $this->groupByBlockIndex(($this->newsFilters ?? collect())->where('block_key', 'news'), fn ($filter) => [
                'field' => $filter->field,
                'value' => $filter->value,
                'position' => $filter->position,
            ]),
            'news_list' => $this->groupByBlockIndex(($this->newsFilters ?? collect())->where('block_key', 'news_list'), fn ($filter) => [
                'field' => $filter->field,
                'value' => $filter->value,
                'position' => $filter->position,
            ]),
            'stats' => $this->groupByBlockIndex($this->statItems ?? collect(), fn ($item) => [
                'value' => $item->value,
                'label' => $item->label,
                'position' => $item->position,
            ]),
            'faq' => $this->groupByBlockIndex($this->faqItems ?? collect(), fn ($item) => [
                'question' => $item->question,
                'answer' => $item->answer,
                'position' => $item->position,
            ]),
            'reviews' => $this->groupByBlockIndex($this->reviewItems ?? collect(), fn ($item) => [
                'name' => $item->name,
                'date' => $item->date,
                'rating' => $item->rating,
                'text' => $item->text,
                'avatar' => $this->mediaUrl($item->avatar),
                'position' => $item->position,
            ]),
        ];

        return collect($blocks)
            ->map(function ($block, int $index) use ($relations) {
                $name = $block['name'] ?? null;
                if (!$name) {
                    return null;
                }

                $key = $block['key'] ?? $index;
                $blockIndex = $this->normalizeBlockIndex($key);
                $values = $this->normalizeValues($block['values'] ?? []);

                $values = $this->applyRelationValues($name, $blockIndex, $values, $relations);

                return [
                    'name' => $name,
                    'key' => $key,
                    'values' => $values,
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function normalizeRawBlocks(): array
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

                return is_array($block) ? $block : null;
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function groupByBlockIndex(Collection $items, callable $map): array
    {
        return $items
            ->groupBy(fn ($item) => $item->block_index ?? 0)
            ->map(fn ($group) => $group
                ->sortBy(fn ($item) => [$item->position, $item->id])
                ->values()
                ->map($map)
                ->toArray())
            ->toArray();
    }

    private function normalizeBlockIndex(mixed $index): int
    {
        return is_numeric($index) ? (int) $index : 0;
    }

    private function normalizeValues(mixed $values): array
    {
        if ($values instanceof Collection) {
            $values = $values->toArray();
        }

        if (is_object($values) && method_exists($values, 'toArray')) {
            $values = $values->toArray();
        }

        return is_array($values) ? $values : [];
    }

    private function applyRelationValues(string $name, int $blockIndex, array $values, array $relations): array
    {
        $relationValues = fn (string $key): array => $relations[$key][$blockIndex] ?? [];

        switch ($name) {
            case 'hero':
                $values['slides'] = $relationValues('hero');
                break;
            case 'hero_values':
                $values['items'] = $relationValues('hero_values');
                break;
            case 'product_nav':
                $values['items'] = $relationValues('product_nav');
                break;
            case 'interactive_header':
                $values['items'] = $relationValues('interactive_header');
                break;
            case 'product_hero':
                $values['badges'] = $relationValues('product_hero');
                break;
            case 'product_specs':
                $values['tabs'] = $relationValues('product_specs');
                break;
            case 'feature_grid':
                $values['items'] = $relationValues('feature_grid');
                break;
            case 'product_carousel':
                $values['query'] = $this->mergeFilters($values['query'] ?? [], $relationValues('product_carousel'));
                break;
            case 'games_gallery':
                $values['query'] = $this->mergeFilters($values['query'] ?? [], $relationValues('games_gallery'));
                break;
            case 'games_grid':
                $values['query'] = $this->mergeFilters($values['query'] ?? [], $relationValues('games_grid'));
                break;
            case 'news':
                $values['query'] = $this->mergeFilters($values['query'] ?? [], $relationValues('news'));
                break;
            case 'news_list':
                $values['query'] = $this->mergeFilters($values['query'] ?? [], $relationValues('news_list'));
                break;
            case 'stats':
                $values['items'] = $relationValues('stats');
                break;
            case 'faq':
                $values['items'] = $relationValues('faq');
                break;
            case 'reviews':
                $values['items'] = $relationValues('reviews');
                break;
            default:
                break;
        }

        return $values;
    }

    private function mergeFilters(mixed $query, array $filters): array
    {
        if ($query instanceof Collection) {
            $query = $query->toArray();
        }

        if (!is_array($query)) {
            $query = [];
        }

        $query['filter'] = $filters;

        return $query;
    }
}
