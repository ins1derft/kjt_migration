<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
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
            'hero_image' => $this->hero_image,
            'seo' => [
                'title' => $this->seo_title,
                'description' => $this->seo_description,
                'canonical' => $this->seo_canonical,
                'og_image' => $this->seo_og_image,
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
        ];
    }
}
