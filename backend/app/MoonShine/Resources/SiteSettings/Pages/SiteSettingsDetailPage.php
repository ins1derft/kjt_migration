<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SiteSettings\Pages;

use App\MoonShine\Resources\SiteSettings\SiteSettingsResource;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\Color;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Text;

/**
 * @extends DetailPage<SiteSettingsResource>
 */
class SiteSettingsDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Logo', 'logo')
                ->disk('public')
                ->dir('site-settings'),
            Text::make('Header phone', 'header_phone'),
            Text::make('Header WhatsApp URL', 'header_whatsapp'),
            Text::make('Contact address line 1', 'contact_address_line1'),
            Text::make('Contact address line 2', 'contact_address_line2'),
            Text::make('Contact phone main', 'contact_phone_main'),
            Text::make('Contact phone main label', 'contact_phone_main_label'),
            Text::make('Contact phone WhatsApp', 'contact_phone_whatsapp'),
            Text::make('Contact phone WhatsApp label', 'contact_phone_whatsapp_label'),
            Text::make('Contact email', 'contact_email'),
            Text::make('Contact hours', 'contact_hours'),
            Text::make('Support phone', 'support_phone'),
            Text::make('Support phone label', 'support_phone_label'),
            Text::make('Support email', 'support_email'),
            Json::make('Social links', 'social_links')
                ->fields([
                    Text::make('Label', 'label'),
                    Text::make('URL', 'href'),
                    Text::make('Icon code', 'icon'),
                    Color::make('Header icon color', 'header_color')->readonly(),
                    Color::make('Footer icon color', 'footer_color')->readonly(),
                    Text::make('Open in new tab', 'targetBlank'),
                ]),
        ];
    }
}
