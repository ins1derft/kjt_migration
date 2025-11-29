<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class GameResource extends JsonResource
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
            'genre' => $this->genre,
            'target_age' => $this->target_age,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'hero_image' => $this->mediaUrl($this->hero_image),
            'game_type' => $this->game_type,
            'video_url' => $this->video_url,
            'is_indexable' => (bool) $this->is_indexable,
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
                'canonical' => $this->seo_canonical,
                'og_image' => $this->mediaUrl($this->seo_og_image),
            ],
            'categories' => $this->whenLoaded('categories', function () {
                return $this->categories->map(function ($category) {
                    return [
                        'slug' => $category->slug,
                        'name' => $category->name,
                        'description' => $category->description,
                    ];
                })->values();
            }),
            'products_used' => $this->whenLoaded('products', function () {
                return $this->products->map(function ($product) {
                    return [
                        'slug' => $product->slug,
                        'name' => $product->name,
                        'product_type' => $product->product_type,
                    ];
                })->values();
            }),
        ];
    }
}
