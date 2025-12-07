<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerns\FormatsMediaUrls;

class SiteSettingsResource extends JsonResource
{
    use FormatsMediaUrls;

    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        $rawSocial = is_array($this->social_links ?? null) ? $this->social_links : [];

        $socialLinks = [];

        foreach ($rawSocial as $item) {
            if (!is_array($item)) {
                continue;
            }

            $color = $item['color'] ?? null;

            $socialLinks[] = [
                'label' => $item['label'] ?? null,
                'href' => $item['href'] ?? null,
                'icon' => $item['icon'] ?? null,
                'targetBlank' => (bool) ($item['targetBlank'] ?? $item['target_blank'] ?? true),
                'color' => $color,
                'headerColor' => $item['header_color'] ?? $color,
                'footerColor' => $item['footer_color'] ?? $color,
            ];
        }

        return [
            'logo_url' => $this->mediaUrl($this->logo),
            'header_phone' => $this->header_phone,
            'header_whatsapp' => $this->header_whatsapp,
            'contact_address_line1' => $this->contact_address_line1,
            'contact_address_line2' => $this->contact_address_line2,
            'contact_phone_main' => $this->contact_phone_main,
            'contact_phone_main_label' => $this->contact_phone_main_label,
            'contact_phone_whatsapp' => $this->contact_phone_whatsapp,
            'contact_phone_whatsapp_label' => $this->contact_phone_whatsapp_label,
            'contact_email' => $this->contact_email,
            'contact_hours' => $this->contact_hours,
            'support_phone' => $this->support_phone,
            'support_phone_label' => $this->support_phone_label,
            'support_email' => $this->support_email,
            'social_links' => $socialLinks,
        ];
    }
}
