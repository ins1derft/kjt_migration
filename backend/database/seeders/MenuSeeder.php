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

        $position = 1;

        $create = function (array $data) use ($menu, &$position) {
            return MenuItem::create([
                ...$data,
                'menu_id' => $menu->id,
                'position' => $position++,
                'is_active' => true,
            ]);
        };

        // Top bars
        foreach ([
            ['label' => 'News', 'url' => '/news', 'slot' => 'top_primary'],
            ['label' => 'Case Studies', 'url' => '/case-studies', 'slot' => 'top_primary'],
            ['label' => 'Testimonials', 'url' => '/news', 'slot' => 'top_primary'],
        ] as $item) {
            $create($item);
        }

        foreach ([
            ['label' => 'FAQs', 'url' => '/news', 'slot' => 'top_secondary'],
            ['label' => 'Support', 'url' => 'mailto:support@kidsjumptech.com', 'slot' => 'top_secondary'],
        ] as $item) {
            $create($item);
        }

        foreach ([
            ['label' => 'Facebook', 'url' => 'https://www.facebook.com/kidsjumptech/', 'slot' => 'social', 'icon' => 'f', 'opens_in_new_tab' => true],
            ['label' => 'Instagram', 'url' => 'https://www.instagram.com/kidsjumptech/', 'slot' => 'social', 'icon' => 'ig', 'opens_in_new_tab' => true],
            ['label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/company/kidsjumptech/', 'slot' => 'social', 'icon' => 'in', 'opens_in_new_tab' => true],
            ['label' => 'YouTube', 'url' => 'https://www.youtube.com/channel/UCXwxinewM8-6sC7ltS37LXw', 'slot' => 'social', 'icon' => 'yt', 'opens_in_new_tab' => true],
        ] as $item) {
            $create($item);
        }

        // Primary nav
        $home = $create(['label' => 'Home', 'url' => '/', 'slot' => 'primary']);
        $productsExperiences = $create(['label' => 'Products & Experiences', 'url' => '/games', 'slot' => 'primary']);
        $create(['label' => 'Industries', 'url' => '/case-studies', 'slot' => 'primary']);
        $create(['label' => 'Why Us', 'url' => '/news', 'slot' => 'primary']);
        $create(['label' => 'Contact', 'url' => '#contact', 'slot' => 'primary']);

        // Dropdown groups under Products & Experiences
        $productsGroup = $create([
            'label' => 'Products',
            'url' => '/games',
            'slot' => 'primary',
            'parent_id' => $productsExperiences->id,
        ]);

        $experiencesGroup = $create([
            'label' => 'Experiences',
            'url' => '/games',
            'slot' => 'primary',
            'parent_id' => $productsExperiences->id,
        ]);

        $servicesGroup = $create([
            'label' => 'Services',
            'url' => '/games',
            'slot' => 'primary',
            'parent_id' => $productsExperiences->id,
        ]);

        $productsLinks = [
            ['label' => 'Interactive Floor', 'url' => '/interactive-floor/'],
            ['label' => 'Mobile Interactive Floor', 'url' => '/interactive-floor-mobil/'],
            ['label' => 'Interactive Wall', 'url' => '/interactive-throw-wall/'],
            ['label' => 'Mobile Interactive Wall', 'url' => '/mobile-interactive-ball-wall/'],
            ['label' => 'Interactive AR Sandbox', 'url' => '/interactive-sandbox/'],
            ['label' => 'Multi-Touch Screen Tables', 'url' => '/interactive-multitouch-tables/'],
            ['label' => 'Interactive Shooting', 'url' => '/interactive-shooting-gallery/'],
            ['label' => 'Interactive Swing', 'url' => '/interactive-swing/'],
            ['label' => 'Alive Sketch', 'url' => '/alive-draw/'],
            ['label' => 'Interactive Climbing', 'url' => '/interactive-climbing-wall/'],
            ['label' => 'Interactive Slide', 'url' => '/interactive-slider/'],
            ['label' => 'Animated Drawing', 'url' => '/animated-drawing/'],
            ['label' => 'Interactive Projector', 'url' => '/interactive-game-projector/'],
        ];

        foreach ($productsLinks as $link) {
            $create([
                ...$link,
                'slot' => 'primary',
                'parent_id' => $productsGroup->id,
            ]);
        }

        $experienceLinks = [
            ['label' => 'Special Needs', 'url' => '/special-needs/'],
            ['label' => 'Sensory Room', 'url' => '/sensory-room/'],
            ['label' => 'Interactive Digital Parks', 'url' => '/interactive-digital-parks/'],
            ['label' => 'Interactive Playground', 'url' => '/interactive-playground/'],
            ['label' => 'Games and Activities', 'url' => '/games/'],
            ['label' => 'Game Creator', 'url' => '/game-creator/'],
        ];

        foreach ($experienceLinks as $link) {
            $create([
                ...$link,
                'slot' => 'primary',
                'parent_id' => $experiencesGroup->id,
            ]);
        }

        $servicesLinks = [
            ['label' => 'Custom Software Development', 'url' => '/custom-software-development/'],
            ['label' => 'Product Support', 'url' => '/product-support/'],
        ];

        foreach ($servicesLinks as $link) {
            $create([
                ...$link,
                'slot' => 'primary',
                'parent_id' => $servicesGroup->id,
            ]);
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
