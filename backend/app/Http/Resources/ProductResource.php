<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class ProductResource extends JsonResource
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
            'subtitle' => $this->subtitle,
            'excerpt' => $this->excerpt,
            'description' => $this->description,
            'hero_image' => $this->mediaUrl($this->hero_image),
            'product_type' => $this->product_type,
            'default_cta_label' => $this->default_cta_label,
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
                'canonical' => $this->seo_canonical,
                'og_image' => $this->mediaUrl($this->seo_og_image),
            ],
            'variants' => $this->whenLoaded('variants', function () {
                return $this->variants->map(function ($variant) {
                    return [
                        'id' => $variant->id,
                        'name' => $variant->name,
                        'sku' => $variant->sku,
                        'price' => $variant->price,
                        'label' => $variant->label,
                        'specs' => $variant->specs,
                        'position' => $variant->position,
                    ];
                })->values();
            }),
            'industries' => $this->whenLoaded('industries', function () {
                return $this->industries->map(function ($industry) {
                    return [
                        'slug' => $industry->slug,
                        'name' => $industry->name,
                        'group' => $industry->group,
                    ];
                })->values();
            }),
        ];
    }
}
