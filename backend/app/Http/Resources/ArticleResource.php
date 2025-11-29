<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class ArticleResource extends JsonResource
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
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'featured_image' => $this->mediaUrl($this->featured_image),
            'status' => $this->status,
            'published_at' => $this->published_at?->toAtomString(),
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
                        'group' => $category->group,
                        'parent_id' => $category->parent_id,
                    ];
                })->values();
            }),
        ];
    }
}
