<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FiltersFields;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    use FiltersFields;

    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        $data = [
            'slug' => $this->slug,
            'name' => $this->name,
            'location' => $this->location,
            'items' => MenuItemResource::collection($this->whenLoaded('rootItems', function () {
                return $this->rootItems->load('childrenRecursive');
            })),
        ];

        return $this->filterFields($data, $request);
    }
}
