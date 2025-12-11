<?php

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::transaction(function () {
            $menu = Menu::query()->firstOrCreate(
                ['slug' => 'main-footer'],
                [
                    'name' => 'Main Footer',
                    'location' => 'footer',
                    'is_active' => true,
                ],
            );

            $columns = [
                'Catalog' => [
                    ['Interactive Floor', '/interactive-floor'],
                    ['Interactive Mobile Floor', '/interactive-floor-mobil'],
                    ['Interactive Sandboxes', '/interactive-sandbox'],
                    ['Interactive Digital Parks', '/interactive-digital-parks'],
                    ['Interactive Playground', '/interactive-playground'],
                    ['Games Catalog', '/games'],
                ],
                'Helpful Links' => [
                    ['News', '/news'],
                    ['Case Studies', '/case-studies'],
                    ['Store', '/store'],
                    ['Contact', '#contact'],
                ],
            ];

            $position = 0;

            foreach ($columns as $label => $children) {
                $parent = MenuItem::query()->firstOrCreate(
                    [
                        'menu_id' => $menu->id,
                        'parent_id' => null,
                        'label' => $label,
                    ],
                    [
                        'url' => '#',
                        'slot' => 'footer',
                        'opens_in_new_tab' => false,
                        'is_active' => true,
                        'position' => $position++,
                    ],
                );

                $childPosition = 0;

                foreach ($children as [$childLabel, $childUrl]) {
                    MenuItem::query()->updateOrCreate(
                        [
                            'menu_id' => $menu->id,
                            'parent_id' => $parent->id,
                            'label' => $childLabel,
                        ],
                        [
                            'url' => $childUrl,
                            'slot' => 'footer',
                            'opens_in_new_tab' => false,
                            'is_active' => true,
                            'position' => $childPosition++,
                        ],
                    );
                }
            }
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            $menu = Menu::query()->where('slug', 'main-footer')->first();

            if (! $menu) {
                return;
            }

            MenuItem::query()
                ->where('menu_id', $menu->id)
                ->whereIn('label', ['Catalog', 'Helpful Links'])
                ->delete();

            MenuItem::query()
                ->where('menu_id', $menu->id)
                ->whereIn('label', [
                    'Interactive Floor',
                    'Interactive Mobile Floor',
                    'Interactive Sandboxes',
                    'Interactive Digital Parks',
                    'Interactive Playground',
                    'Games Catalog',
                    'News',
                    'Case Studies',
                    'Store',
                    'Contact',
                ])
                ->delete();
        });
    }
};
