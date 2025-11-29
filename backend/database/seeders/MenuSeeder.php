<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $header = Menu::firstOrCreate(
            ['slug' => 'main-header'],
            ['name' => 'Main Header', 'location' => 'header', 'is_active' => true]
        );

        $footer = Menu::firstOrCreate(
            ['slug' => 'main-footer'],
            ['name' => 'Main Footer', 'location' => 'footer', 'is_active' => true]
        );

        $this->seedHeader($header);
        $this->seedFooter($footer);
    }

    protected function seedHeader(Menu $menu): void
    {
        $menu->items()->delete();

        $topPrimary = [
            ['label' => 'News', 'url' => '/news', 'slot' => 'top_primary'],
            ['label' => 'Case Studies', 'url' => '/case-studies', 'slot' => 'top_primary'],
            ['label' => 'Testimonials', 'url' => '/news', 'slot' => 'top_primary'],
        ];

        $topSecondary = [
            ['label' => 'FAQs', 'url' => '/news', 'slot' => 'top_secondary'],
            ['label' => 'Support', 'url' => 'mailto:support@kidsjumptech.com', 'slot' => 'top_secondary'],
        ];

        $social = [
            ['label' => 'Facebook', 'url' => 'https://www.facebook.com/kidsjumptech/', 'slot' => 'social', 'icon' => 'f', 'opens_in_new_tab' => true],
            ['label' => 'Instagram', 'url' => 'https://www.instagram.com/kidsjumptech/', 'slot' => 'social', 'icon' => 'ig', 'opens_in_new_tab' => true],
            ['label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/company/kidsjumptech/', 'slot' => 'social', 'icon' => 'in', 'opens_in_new_tab' => true],
            ['label' => 'YouTube', 'url' => 'https://www.youtube.com/channel/UCXwxinewM8-6sC7ltS37LXw', 'slot' => 'social', 'icon' => 'yt', 'opens_in_new_tab' => true],
        ];

        $primary = [
            ['label' => 'Home', 'url' => '/', 'slot' => 'primary'],
            ['label' => 'Products & Experiences', 'url' => '/games', 'slot' => 'primary'],
            ['label' => 'Industries', 'url' => '/case-studies', 'slot' => 'primary'],
            ['label' => 'Why Us', 'url' => '/news', 'slot' => 'primary'],
            ['label' => 'Contact', 'url' => '#contact', 'slot' => 'primary'],
        ];

        $position = 1;

        foreach ([$topPrimary, $topSecondary, $social, $primary] as $group) {
            foreach ($group as $item) {
                MenuItem::create([
                    ...$item,
                    'menu_id' => $menu->id,
                    'position' => $position++,
                    'is_active' => true,
                ]);
            }
        }
    }

    protected function seedFooter(Menu $menu): void
    {
        $menu->items()->delete();

        // Root columns
        $catalog = MenuItem::create([
            'menu_id' => $menu->id,
            'label' => 'Catalog',
            'url' => '/catalog',
            'slot' => 'primary',
            'position' => 1,
            'is_active' => true,
        ]);

        $helpful = MenuItem::create([
            'menu_id' => $menu->id,
            'label' => 'Helpful Links',
            'url' => '/helpful',
            'slot' => 'primary',
            'position' => 2,
            'is_active' => true,
        ]);

        $catalogLinks = [
            ['label' => 'Interactive Floor', 'url' => '/interactive-floor'],
            ['label' => 'Interactive Mobile Floor', 'url' => '/interactive-floor-mobil'],
            ['label' => 'Interactive Sandboxes', 'url' => '/interactive-sandbox'],
            ['label' => 'Interactive Digital Parks', 'url' => '/interactive-digital-parks'],
            ['label' => 'Interactive Playground', 'url' => '/interactive-playground'],
            ['label' => 'Games Catalog', 'url' => '/games'],
        ];

        $helpfulLinks = [
            ['label' => 'News', 'url' => '/news'],
            ['label' => 'Case Studies', 'url' => '/case-studies'],
            ['label' => 'Store', 'url' => '/store'],
            ['label' => 'Contact', 'url' => '#contact'],
        ];

        $pos = 1;
        foreach ($catalogLinks as $link) {
            MenuItem::create([
                ...$link,
                'menu_id' => $menu->id,
                'parent_id' => $catalog->id,
                'slot' => 'primary',
                'position' => $pos++,
                'is_active' => true,
            ]);
        }

        $pos = 1;
        foreach ($helpfulLinks as $link) {
            MenuItem::create([
                ...$link,
                'menu_id' => $menu->id,
                'parent_id' => $helpful->id,
                'slot' => 'primary',
                'position' => $pos++,
                'is_active' => true,
            ]);
        }

        $socialLinks = [
            ['label' => 'Facebook', 'url' => 'https://www.facebook.com/kidsjumptech/', 'icon' => 'f'],
            ['label' => 'Instagram', 'url' => 'https://www.instagram.com/kidsjumptech/', 'icon' => 'ig'],
            ['label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/company/kidsjumptech/', 'icon' => 'in'],
            ['label' => 'YouTube', 'url' => 'https://www.youtube.com/channel/UCXwxinewM8-6sC7ltS37LXw', 'icon' => 'yt'],
        ];

        $pos = 1;
        foreach ($socialLinks as $link) {
            MenuItem::create([
                ...$link,
                'menu_id' => $menu->id,
                'slot' => 'social',
                'position' => $pos++,
                'is_active' => true,
                'opens_in_new_tab' => true,
            ]);
        }
    }
}
