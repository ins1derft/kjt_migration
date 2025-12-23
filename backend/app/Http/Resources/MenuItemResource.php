<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FiltersFields;
use App\Http\Resources\Concerns\FormatsMediaUrls;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    use FiltersFields;
    use FormatsMediaUrls;

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
            'icon_url' => $this->mediaUrl($this->icon_image),
            'opens_in_new_tab' => (bool) $this->opens_in_new_tab,
            'children' => MenuItemResource::collection($this->whenLoaded('childrenRecursive', function () {
                return $this->childrenRecursive;
            })),
        ];

        return $this->filterFields($data, $request);
    }
}
