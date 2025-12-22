<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsMediaUrls;
use Illuminate\Http\Resources\Json\JsonResource;

class TrustedLogoResource extends JsonResource
{
    use FormatsMediaUrls;

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'image' => $this->mediaUrl($this->image),
            'alt' => $this->alt,
            'position' => $this->position,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
