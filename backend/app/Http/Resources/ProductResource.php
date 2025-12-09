<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;
use App\Http\Resources\Concerns\FiltersFields;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'slogan' => $this->slogan,
            'excerpt' => $this->excerpt,
            'description' => $this->description,
            'hero_image' => $this->mediaUrl($this->hero_image),
            'default_cta_label' => $this->default_cta_label,
            'rating' => $this->rating,
            'review_count_label' => $this->review_count_label,
            'badges' => $this->badges,
            'form' => $this->whenLoaded('form', function () {
                return $this->form ? [
                    'id' => $this->form->id,
                    'code' => $this->form->code,
                    'title' => $this->form->title,
                    'topic' => $this->form->topic,
                ] : null;
            }),
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
                        'image' => $this->mediaUrl($variant->image),
                        'price' => $variant->price,
                        'label' => $variant->label,
                        'is_highlighted' => (bool) $variant->is_highlighted,
                        'specs' => $variant->specs,
                        'position' => $variant->position,
                    ];
                })->values();
            }),
        ];

        return $this->filterFields($data, $request);
    }
}
