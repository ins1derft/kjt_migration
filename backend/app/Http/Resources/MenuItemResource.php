<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'url' => $this->url,
            'slot' => $this->slot,
            'icon' => $this->icon,
            'opens_in_new_tab' => (bool) $this->opens_in_new_tab,
            'children' => MenuItemResource::collection($this->whenLoaded('childrenRecursive', function () {
                return $this->childrenRecursive;
            })),
        ];
    }
}
