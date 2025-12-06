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
            'badges' => $this->whenLoaded('badges', function () {
                return $this->badges->map(function ($badge) {
                    return [
                        'image' => $this->mediaUrl($badge->image),
                        'label' => $badge->label,
                        'position' => $badge->position,
                    ];
                })->values();
            }),
            'form' => $this->whenLoaded('form', function () {
                return $this->form ? [
                    'id' => $this->form->id,
                    'code' => $this->form->code,
                    'title' => $this->form->title,
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

        return $this->filterFields($data, $request);
    }
}
