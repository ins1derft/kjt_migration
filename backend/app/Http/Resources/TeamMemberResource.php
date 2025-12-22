<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Concerns\FormatsMediaUrls;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    use FormatsMediaUrls;

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'role' => $this->role,
            'department' => $this->department,
            'photo' => $this->mediaUrl($this->photo) ?? '/images/placeholders/no-image.jpg',
            'bio' => $this->bio,
            'position' => $this->position,
            'is_active' => (bool) $this->is_active,
        ];
    }
}
