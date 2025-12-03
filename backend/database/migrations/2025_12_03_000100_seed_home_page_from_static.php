<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'home';

        if (DB::table('pages')->where('slug', $slug)->exists()) {
            return;
        }

        $now = Carbon::now();

        $blocks = [
            [
                'name' => 'hero',
                'values' => [
                    'title' => 'Interactive Equipment For Kids',
                    'slides' => [
                        ['id' => 1, 'videoId' => 'QNT7l1TT7_0', 'alt' => 'Interactive Floor'],
                        ['id' => 2, 'videoId' => 'Ktkh_mW2ADg', 'alt' => 'Interactive Wall'],
                        ['id' => 3, 'videoId' => 'nJSXQ9uxvO0', 'alt' => 'Alive Sketches'],
                        ['id' => 4, 'videoId' => 'ojKgw68k1Qk', 'alt' => 'Interactive Climbing'],
                    ],
                ],
            ],
            [
                'name' => 'hero_values',
                'values' => [
                    'title' => 'Interactive Equipment For Kids',
                    'subtitle' => 'Turn-Key Interactive Systems for Your Environment',
                    'text' => 'Yes, any space can become an exciting educational adventure where kids can dive into fun and learn with their whole selves – body, mind, and heart.',
                    'ctaLabel' => 'Live Demo',
                    'ctaHref' => 'mailto:info@kidsjumptech.com?subject=Live%20Demo',
                    'columns' => 4,
                    'items' => [
                        [
                            'title' => 'Warranty',
                            'description' => 'From 2 to 5 years on all equipment',
                            'icon' => '/icons/feature_grids/warranty.svg',
                        ],
                        [
                            'title' => 'Technical Support',
                            'description' => '24/7 remote technical support for prompt software issue resolution',
                            'icon' => '/icons/feature_grids/tech_support.svg',
                        ],
                        [
                            'title' => 'No Subscriptions',
                            'description' => 'You only pay once for the equipment, games, and subsequent updates.',
                            'icon' => '/icons/feature_grids/no_subs.svg',
                        ],
                        [
                            'title' => 'Useful',
                            'description' => 'Our equipment is designed to help develop certain skills. Compatible with special needs kids',
                            'icon' => '/icons/feature_grids/useful.svg',
                        ],
                    ],
                ],
            ],
            [
                'name' => 'product_carousel',
                'values' => [
                    'title' => 'The World of Interactive Wonders!',
                    'description' => 'Dive into a Whirlwind Adventure Through an Interactive Wonderland, Where Every Twist and Turn Sparks Joy and Friendship!',
                    'query' => [
                        'limit' => 12,
                        'fields' => ['slug', 'name', 'slogan', 'hero_image'],
                    ],
                ],
            ],
            [
                'name' => 'trusted_by',
                'values' => [
                    'title' => 'Tested. Trusted. Implemented.',
                    'description' => 'Our products have been implemented by leading local and national brands in the entertainment, fitness, and education industry.',
                    'footerText' => 'We manufacture equipment for schools, libraries, museums, development centers, hospitals and home use.',
                    'query' => [
                        'fields' => ['image', 'alt', 'position'],
                    ],
                ],
            ],
            [
                'name' => 'stats',
                'values' => [
                    'title' => 'Let’s Bring That Room to Life',
                    'items' => [
                        ['value' => '100%', 'label' => 'Positive Feedback'],
                        ['value' => '21+', 'label' => 'Interactive products'],
                        ['value' => '40+', 'label' => 'Countries'],
                    ],
                ],
            ],
            [
                'name' => 'feature_grid',
                'values' => [
                    'title' => 'Core Features',
                    'columns' => 3,
                    'items' => [
                        ['title' => 'High Quality', 'description' => 'Our equipment is developed and made in the USA', 'icon' => null],
                        ['title' => 'Reputation', 'description' => 'We have over 90 5-star reviews', 'icon' => null],
                        ['title' => 'Turnkey Delivery', 'description' => 'Your product will be delivered safely. We provide free training.', 'icon' => null],
                        ['title' => 'Mobility', 'description' => 'Easy to move, no ceiling attachment needed.', 'icon' => null],
                        ['title' => 'High-Speed Sensors', 'description' => 'Sensors instantly react to touch.', 'icon' => null],
                        ['title' => 'Free Updates', 'description' => 'Clients receive new games and software for free regularly.', 'icon' => null],
                        ['title' => 'Customization', 'description' => 'We customize products with any color, design, or logo.', 'icon' => null],
                        ['title' => 'Easy Setup', 'description' => "Just plug the equipment into an outlet and you're set.", 'icon' => null],
                        ['title' => 'Premium Support', 'description' => '24/7 remote help plus onboarding.', 'icon' => null],
                    ],
                ],
            ],
            [
                'name' => 'why_us',
                'values' => [
                    'title' => 'Why Us?',
                ],
            ],
            [
                'name' => 'cta_section',
                'values' => [
                    'title' => 'Visit our showroom or schedule a Zoom call',
                    'description' => 'We will call you back from (877) 901-0110 within 10 minutes during our business hours, which are from 9 AM to 6 PM EST',
                    'ctaLabel' => 'Live demo',
                    'ctaHref' => 'mailto:info@kidsjumptech.com?subject=Showroom%20or%20Zoom%20visit',
                    'backgroundImage' => '',
                ],
            ],
            [
                'name' => 'games_gallery',
                'values' => [
                    'title' => 'Meet the A-list of Games and Activities.',
                    'description' => 'Are you ready for a game-changer? Our collection of move-worthy games and activities (and growing) is the ultimate solution to combining fun, exercise, and learning!',
                    'query' => [
                        'limit' => 12,
                        'fields' => ['slug', 'title', 'hero_image'],
                    ],
                ],
            ],
            [
                'name' => 'reviews',
                'values' => [
                    'title' => 'Feedback and suggestions',
                    'ctaHref' => 'https://go.repute.city/kids-jump-tech',
                    'ctaLabel' => 'Leave a review',
                    'query' => [
                        'limit' => 12,
                        'onlyActive' => true,
                    ],
                ],
            ],
            [
                'name' => 'news',
                'values' => [
                    'title' => 'News & Insights',
                    'description' => 'See How Interactive Technologies are Shaping the Future of Education',
                    'query' => [
                        'limit' => 8,
                        'fields' => ['slug', 'title', 'featured_image', 'published_at', 'categories'],
                    ],
                ],
            ],
            [
                'name' => 'highlight_cta',
                'values' => [
                    'title' => 'Transform Your Environment 🚀',
                    'description' => 'If you are ready to elevate your space with cutting-edge interactive technology we are here to make it a reality for you. Reach out to us today and let’s make learning an adventure! 🌟',
                    'ctaLabel' => 'Contact Us',
                    'ctaHref' => 'mailto:info@kidsjumptech.com?subject=Transform%20my%20space',
                ],
            ],
        ];

        DB::table('pages')->insert([
            'slug' => $slug,
            'title' => 'Home',
            'type' => 'static',
            'status' => 'published',
            'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            'seo_title' => 'Kids Jump Tech | Interactive Equipment For Kids',
            'seo_description' => 'Turn-key interactive systems and games that turn any space into an immersive learning adventure for kids.',
            'seo_canonical' => 'https://kidsjumptech.com/',
            'seo_og_image' => null,
            'published_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        DB::table('pages')
            ->where('slug', 'home')
            ->delete();
    }
};
