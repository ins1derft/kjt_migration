<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FiltersFields;

class MenuItemResource extends JsonResource
{
    use FiltersFields;

    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        $data = [
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

        return $this->filterFields($data, $request);
    }
}
