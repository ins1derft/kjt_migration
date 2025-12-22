<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\SiteSettings\Pages;

use App\MoonShine\Resources\SiteSettings\SiteSettingsResource;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\UI\Components\Layout\Box;
use MoonShine\UI\Fields\Color;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Json;
use MoonShine\UI\Fields\Switcher;
use MoonShine\UI\Fields\Text;

/**
 * @extends FormPage<SiteSettingsResource>
 */
class SiteSettingsFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Header & logo', [
                ID::make(),
                Image::make('Logo', 'logo')
                    ->disk('public')
                    ->dir('site-settings')
                    ->removable(),
                Text::make('Header phone', 'header_phone')
                    ->hint('Number for header phone icon, without tel: prefix'),
                Text::make('Header WhatsApp URL', 'header_whatsapp')
                    ->hint('WhatsApp link for header icon (e.g. https://wa.me/15613828555)'),
            ]),

            Box::make('Contacts', [
                Text::make('Address line 1', 'contact_address_line1'),
                Text::make('Address line 2', 'contact_address_line2'),
                Text::make('Main phone (display)', 'contact_phone_main'),
                Text::make('Main phone label', 'contact_phone_main_label')
                    ->hint('Small caption under main phone, e.g. "Toll free number"'),
                Text::make('WhatsApp phone (display)', 'contact_phone_whatsapp'),
                Text::make('WhatsApp phone label', 'contact_phone_whatsapp_label')
                    ->hint('Small caption under WhatsApp phone'),
                Text::make('Contact email', 'contact_email'),
                Text::make('Contact hours', 'contact_hours'),
            ]),

            Box::make('Support', [
                Text::make('Support phone (display)', 'support_phone'),
                Text::make('Support phone label', 'support_phone_label'),
                Text::make('Support email', 'support_email'),
            ]),

            Box::make('Social links', [
                Json::make('Social links', 'social_links')
                    ->fields([
                        Text::make('Label', 'label'),
                        Text::make('URL', 'href'),
                        Text::make('Icon code', 'icon')
                            ->hint('Use Iconify ID (e.g. mdi:facebook) or leave empty for default'),
                        Color::make('Header icon color', 'header_color')
                            ->nullable()
                            ->hint('Optional, pick or paste HEX like #RRGGBB'),
                        Color::make('Footer icon color', 'footer_color')
                            ->nullable()
                            ->hint('Optional, pick or paste HEX like #RRGGBB'),
                        Switcher::make('Open in new tab', 'targetBlank')
                            ->default(true),
                    ])
                    ->vertical()
                    ->creatable()
                    ->removable(),
            ]),
        ];
    }

    protected function rules(DataWrapperContract $item): array
    {
        return [
            'contact_email' => ['nullable', 'email'],
            'support_email' => ['nullable', 'email'],
        ];
    }
}
