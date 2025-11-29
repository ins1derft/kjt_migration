<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'location' => $this->location,
            'items' => MenuItemResource::collection($this->whenLoaded('rootItems', function () {
                return $this->rootItems->load('childrenRecursive');
            })),
        ];
    }
}
