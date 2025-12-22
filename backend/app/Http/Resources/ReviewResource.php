<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class ReviewResource extends JsonResource
{
    use FormatsMediaUrls;

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'review_date' => $this->review_date?->toDateString(),
            'date' => $this->review_date?->format('F j, Y'),
            'rating' => (int) $this->rating,
            'text' => $this->text,
            'avatar' => $this->mediaUrl($this->avatar),
            'video_id' => $this->video_id,
            'source_url' => $this->source_url,
            'position' => (int) $this->position,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
