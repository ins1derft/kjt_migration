<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FiltersFields;
use App\Http\Resources\Concerns\FormatsMediaUrls;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SensoryRoomBundleResource extends JsonResource
{
    use FiltersFields;
    use FormatsMediaUrls;

    public function toArray($request): array
    {
        $data = [
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'gallery' => $this->normalizedGallery(),
            'specs' => $this->normalizedSpecs(),
            'form_code' => $this->form_code,
            'custom_bundle_url' => $this->custom_bundle_url,
            'block_a_title' => $this->block_a_title,
            'block_a_items' => $this->normalizedBlockAItems(),
            'block_b_title' => $this->block_b_title,
            'block_b_text' => $this->block_b_text,
            'status' => $this->status,
            'position' => (int) ($this->position ?? 0),
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
                'canonical' => $this->seo_canonical,
                'og_image' => $this->mediaUrl($this->seo_og_image),
            ],
            'products' => $this->whenLoaded('products', function () {
                return $this->products
                    ->map(fn ($product) => [
                        'slug' => ($product->relationLoaded('landingPage') ? $product->landingPage?->slug : null) ?? $product->slug,
                        'name' => $product->name,
                    ])
                    ->values();
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        if ($breadcrumbs = $this->buildBreadcrumbs($request)) {
            $data['breadcrumbs'] = $breadcrumbs;
        }

        return $this->filterFields($data, $request);
    }

    private function buildBreadcrumbs(Request $request): ?array
    {
        // Breadcrumbs are only needed on the detail endpoint; avoid N+1 queries on the list.
        if (! $request->route('slug')) {
            return null;
        }

        $homeLabel = Page::query()
            ->where('slug', 'home')
            ->where('status', 'published')
            ->value('title') ?? 'Home';

        $sensoryRoomLabel = Page::query()
            ->where('slug', 'sensory-room')
            ->where('status', 'published')
            ->value('title') ?? 'Sensory room';

        return [
            ['label' => $homeLabel, 'href' => '/'],
            ['label' => $sensoryRoomLabel, 'href' => '/sensory-room'],
            ['label' => $this->title, 'href' => null],
        ];
    }

    private function normalizedSpecs(): array
    {
        $specs = $this->specs;
        if (! is_array($specs)) {
            return [];
        }

        return collect($specs)
            ->map(function ($item) {
                if (! is_array($item)) {
                    return null;
                }

                $value = $item['value'] ?? null;
                if (! is_string($value)) {
                    return null;
                }

                $value = trim($value);

                return $value !== '' ? $value : null;
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function normalizedGallery(): array
    {
        $gallery = $this->gallery;
        if (! is_array($gallery)) {
            return [];
        }

        return collect($gallery)
            ->map(function ($item) {
                if (! is_array($item)) {
                    return null;
                }

                $src = $item['src'] ?? null;
                $alt = $item['alt'] ?? null;

                return [
                    'src' => $this->mediaUrl(is_string($src) ? $src : null),
                    'alt' => is_string($alt) ? $alt : null,
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function normalizedBlockAItems(): array
    {
        $items = $this->block_a_items;
        if (! is_array($items)) {
            return [];
        }

        return collect($items)
            ->map(function ($item) {
                if (! is_array($item)) {
                    return null;
                }

                $icon = $item['icon'] ?? null;
                $text = $item['text'] ?? null;

                return [
                    'icon' => $this->mediaUrl(is_string($icon) ? $icon : null),
                    'text' => is_string($text) ? $text : null,
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }
}
