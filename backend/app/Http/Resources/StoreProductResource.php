<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class StoreProductResource extends JsonResource
{
    use FormatsMediaUrls;

    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'excerpt' => $this->excerpt,
            'description' => $this->description,
            'image' => $this->mediaUrl($this->image),
            'price' => $this->price,
            'is_available' => (bool) $this->is_available,
            'specs' => $this->specs,
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
                        'parent_id' => $category->parent_id,
                    ];
                })->values();
            }),
        ];
    }
}
