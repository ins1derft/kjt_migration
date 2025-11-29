<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Game;
use App\Models\StoreProduct;
use App\Models\Article;
use App\Models\Form;
use Carbon\Carbon;

class ImportSampleContentSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Products (root landings) -------------------------------------------------
        $products = [
            [
                'slug' => 'interactive-floor',
                'name' => 'Interactive Floor',
                'subtitle' => 'Bring the room to life & engage',
                'excerpt' => 'Stationary interactive floor with 120+ games.',
                'product_type' => 'floor',
                'hero_image' => null,
                'default_cta_label' => 'Get a Quote',
                'variants' => [
                    [
                        'name' => 'Interactive Floor',
                        'label' => 'Medium-Light Conditions',
                        'price' => 6150,
                        'position' => 1,
                        'specs' => [
                            'projector_lumens' => '3,000',
                            'projection_min' => "7'5\" x 4'2\"",
                            'projection_max' => "13'2\" x 7'5\"",
                            'games_control' => 'External tablet',
                            'warranty_years' => 2,
                            'includes_game_creator' => false,
                            'accessories' => ['Keyboard', 'Installation kit', 'White puzzle mat', 'Manual', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'medium',
                        ],
                    ],
                    [
                        'name' => 'Interactive Floor Plus',
                        'label' => 'High-Light Conditions',
                        'price' => 9900,
                        'position' => 2,
                        'specs' => [
                            'projector_lumens' => '7,200',
                            'projection_min' => "7'5\" x 4'2\"",
                            'projection_max' => "19'8\" x 12'4\"",
                            'games_control' => 'External tablet',
                            'warranty_years' => 2,
                            'includes_game_creator' => false,
                            'accessories' => ['Keyboard', 'Installation kit', 'White puzzle mat', 'Manual', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'high',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'interactive-floor-mobil',
                'name' => 'Interactive Mobile Floor',
                'subtitle' => 'Plug’n’play mobile floor projection',
                'excerpt' => 'World’s first mobile interactive floor with adjustable projection.',
                'product_type' => 'floor-mobile',
                'hero_image' => null,
                'default_cta_label' => 'Get a Quote',
                'variants' => [
                    [
                        'name' => 'Jump Floor Mobile',
                        'label' => 'Medium-Light Conditions',
                        'price' => 8900,
                        'position' => 1,
                        'specs' => [
                            'projector_lumens' => '3,000',
                            'projection_min' => '92" x 51"',
                            'projection_max' => '130" x 76"',
                            'games_control' => 'Built-in tablet',
                            'warranty_years' => 2,
                            'includes_game_creator' => false,
                            'accessories' => ['Keyboard', 'White puzzle mat', 'Manual', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'medium',
                        ],
                    ],
                    [
                        'name' => 'Commercial Floor Mobile',
                        'label' => 'High-Light Conditions',
                        'price' => 14835,
                        'position' => 2,
                        'specs' => [
                            'projector_lumens' => '5,000',
                            'projection_min' => '87" x 56"',
                            'projection_max' => '138" x 84"',
                            'games_control' => 'Built-in tablet',
                            'warranty_years' => 5,
                            'includes_game_creator' => true,
                            'accessories' => ['Keyboard', 'White puzzle mat', 'Manual', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'high',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'interactive-sandbox',
                'name' => 'Interactive AR Sandbox',
                'subtitle' => 'Topography sandbox with AR projection',
                'excerpt' => '22+ games, laser projector on vertical stand, movable.',
                'product_type' => 'sandbox',
                'hero_image' => null,
                'default_cta_label' => 'Get a Quote',
                'variants' => [
                    [
                        'name' => 'AR Sandbox',
                        'label' => 'Base',
                        'price' => 11200,
                        'position' => 1,
                        'specs' => [
                            'projector_lumens' => '4,500',
                            'projection_min' => '55" x 42" x 7"',
                            'projection_max' => '55" x 42" x 7"',
                            'games_control' => 'External tablet',
                            'warranty_years' => 2,
                            'includes_game_creator' => false,
                            'accessories' => ['SensorySand 400 lb', 'Keyboard', 'Manual', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'medium',
                        ],
                    ],
                    [
                        'name' => 'Commercial AR Sandbox 2-in-1',
                        'label' => 'High-Light',
                        'price' => 16999,
                        'position' => 2,
                        'specs' => [
                            'projector_lumens' => '6,200',
                            'projection_min' => '75" x 45" x 7"',
                            'projection_max' => '75" x 45" x 7"',
                            'games_control' => 'External tablet',
                            'warranty_years' => 5,
                            'includes_game_creator' => false,
                            'accessories' => ['SensorySand 600 lb', 'Keyboard', 'Manual', 'White panels', 'Training'],
                            'tech_support' => 'Lifetime',
                            'training' => 'Included',
                            'light_condition' => 'high',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($products as $prodData) {
            $variants = $prodData['variants'];
            unset($prodData['variants']);
            $product = Product::updateOrCreate(
                ['slug' => $prodData['slug']],
                $prodData
            );
            foreach ($variants as $variantData) {
                ProductVariant::updateOrCreate(
                    ['product_id' => $product->id, 'name' => $variantData['name']],
                    $variantData
                );
            }
        }

        // Games -------------------------------------------------
        $game = Game::updateOrCreate(
            ['slug' => 'unknown-planet-2'],
            [
                'title' => 'Unknown Planet',
                'genre' => 'Arcade',
                'game_type' => 'arcade',
                'excerpt' => 'Explore an alien world, battle creatures, boost coordination.',
                'body' => '<p>Embark on an adventure to explore an alien world, battle strange creatures, and use a super weapon. Improves coordination and reaction.</p>',
                'hero_image' => 'https://kidsjumptech.com/wp-content/uploads/2025/01/unknown-planet.webp',
                'video_url' => 'https://www.youtube.com/watch?v=EUpkbPtTdPg',
                'is_indexable' => false,
            ]
        );
        // relate to products
        $floor = Product::where('slug', 'interactive-floor')->first();
        if ($floor) {
            $game->products()->syncWithoutDetaching([$floor->id]);
        }

        // Store products ----------------------------------------
        StoreProduct::updateOrCreate(
            ['slug' => 'mobile-interactive-floor'],
            [
                'name' => 'Mobile interactive floor',
                'excerpt' => 'Portable interactive floor with laser projector and 130+ games.',
                'description' => 'Transforms any space into an interactive learning zone. No ceiling install, built-in tablet, LiDar Slam S2.',
                'image' => 'https://kidsjumptech.com/wp-content/uploads/2024/09/Mobile-interactive-floor.webp',
                'price' => null,
                'is_available' => true,
                'specs' => [
                    'projector_lumens' => '3,000',
                    'resolution' => '1920x1080',
                    'lamp_hours' => '20,000',
                    'light_source' => 'Laser',
                    'sensor' => 'LiDar Slam S2',
                    'form_factor' => 'Mobile',
                    'case' => 'Durable steel',
                    'projection' => 'Adjustable',
                    'computer' => 'Built-in',
                    'software' => '130+ games',
                    'tablet' => 'Built-in tablet for game management',
                    'includes' => ['Keyboard with touch pad', 'White FOAM mats'],
                ],
            ]
        );
        StoreProduct::updateOrCreate(
            ['slug' => 'interactive-wall-ws-se'],
            [
                'name' => 'Interactive Wall WS SE',
                'excerpt' => 'Interactive wall for education and play',
                'description' => 'Bring any room to life with throw wall experiences.',
                'image' => null,
                'price' => null,
                'is_available' => true,
                'specs' => [
                    'projector_lumens' => '3,000',
                    'resolution' => '1920x1080',
                    'form_factor' => 'Wall-mounted',
                    'software' => 'Games pack',
                ],
            ]
        );

        StoreProduct::updateOrCreate(
            ['slug' => 'interactive-floor-gym-size'],
            [
                'name' => 'Interactive Floor GYM size',
                'excerpt' => 'Large projection for gyms',
                'description' => 'High-lumen projector and large projection for gym spaces.',
                'image' => null,
                'price' => null,
                'is_available' => true,
                'specs' => [
                    'projector_lumens' => '7200',
                    'projection_max' => "19'8\" x 12'4\"",
                    'control' => 'External tablet',
                    'software' => '120+ games',
                ],
            ]
        );

        // Articles ---------------------------------------------
        Article::updateOrCreate(
            ['slug' => 'case-of-custom-development'],
            [
                'title' => 'A Case of Custom Development',
                'type' => 'case_study',
                'excerpt' => 'Custom game and equipment for a client project.',
                'body' => '<p>Case study describing custom development for an aquarium client.</p>',
                'status' => 'published',
                'published_at' => $now->copy()->subMonths(10),
            ]
        );

        Article::updateOrCreate(
            ['slug' => 'branson-museum-unveils-kjt-dinosaur-ar-sandbox'],
            [
                'title' => 'Branson Museum Unveils Dinosaur AR Sandbox',
                'type' => 'news',
                'excerpt' => 'Jump story about dinosaur AR sandbox install.',
                'body' => '<p>Branson Museum deployed Kids Jump Tech dinosaur AR sandbox.</p>',
                'status' => 'published',
                'published_at' => $now->copy()->subYears(2),
            ]
        );
        Article::updateOrCreate(
            ['slug' => 'branson-museum-unveils-kids-jump-techs-cutting-edge-dinosaur-ar-sandbox-design-2'],
            [
                'title' => 'Branson Museum Unveils Dinosaur AR Sandbox Design',
                'type' => 'news',
                'excerpt' => 'Cutting-edge dinosaur AR sandbox install at Branson Museum.',
                'body' => '<p>Showcase of dinosaur AR sandbox design and deployment.</p>',
                'status' => 'published',
                'published_at' => $now->copy()->subYears(2),
            ]
        );

        Article::updateOrCreate(
            ['slug' => 'enim-rerum-dolorem-distinctio'],
            [
                'title' => 'New Releases: Enim rerum dolorem distinctio',
                'type' => 'news',
                'excerpt' => 'Example release note from original site.',
                'body' => '<p>Release note placeholder content.</p>',
                'status' => 'published',
                'published_at' => $now->copy()->subMonths(6),
            ]
        );

        // Pages (marketing / experiences / services) -----------
        $pages = [
            [
                'slug' => 'interactive-floor',
                'title' => 'Interactive Floor',
                'type' => 'product_landing',
                'product_slug' => 'interactive-floor',
                'status' => 'published',
                'seo_title' => 'Interactive Floor - Kids Jump Tech',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Floor',
                        'subtitle' => 'Bring the room to life & engage',
                        'badge' => '100+ reviews',
                        'primary_cta_label' => 'Get a Quote',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => '130+ games', 'text' => 'Included library of educational & fun games'],
                            ['heading' => 'No subscriptions', 'text' => 'One-time purchase, free updates'],
                            ['heading' => '2 year warranty', 'text' => 'Hardware coverage'],
                        ],
                    ]],
                    ['layout' => 'comparison_table', 'fields' => [
                        'title' => 'Compare Models',
                        'variants' => [
                            ['name' => 'Interactive Floor', 'price' => '$6,150', 'specs' => [
                                'Projector' => '3,000 Lm laser',
                                'Projection' => "7'5\" x 4'2\" to 13'2\" x 7'5\"",
                                'Control' => 'External tablet',
                                'Warranty' => '2 years',
                            ]],
                            ['name' => 'Interactive Floor Plus', 'price' => '$9,900', 'specs' => [
                                'Projector' => '7,200 Lm laser',
                                'Projection' => "7'5\" x 4'2\" to 19'8\" x 12'4\"",
                                'Control' => 'External tablet',
                                'Warranty' => '2 years',
                            ]],
                        ],
                    ]],
                    ['layout' => 'games_gallery', 'fields' => [
                        'title' => 'Meet the games',
                        'game_slugs' => [ ['slug' => 'unknown-planet-2'] ],
                        'limit' => 6,
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Can it be used in bright light?', 'answer' => 'Use the Plus model for high-light conditions.'],
                            ['question' => 'Is calibration needed each start?', 'answer' => 'No, calibration is retained.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'interactive-floor-mobil',
                'title' => 'Interactive Mobile Floor',
                'type' => 'product_landing',
                'product_slug' => 'interactive-floor-mobil',
                'status' => 'published',
                'seo_title' => 'Mobile Interactive Floor',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Mobile Floor',
                        'subtitle' => 'Plug’n’play in less than a minute',
                        'badge' => '100+ reviews',
                        'primary_cta_label' => 'Get a Quote',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => '130+ games', 'text' => 'Library included'],
                            ['heading' => 'No subscriptions', 'text' => 'Free updates'],
                            ['heading' => '2-5 year warranty', 'text' => 'Depending on model'],
                        ],
                    ]],
                    ['layout' => 'comparison_table', 'fields' => [
                        'title' => 'Compare mobile models',
                        'variants' => [
                            ['name' => 'Jump Floor Mobile', 'price' => '$8,900', 'specs' => [
                                'Projector' => '3,000 Lm', 'Projection' => '92"-130"', 'Control' => 'Built-in tablet', 'Warranty' => '2 years']],
                            ['name' => 'Commercial Floor Mobile', 'price' => '$14,835', 'specs' => [
                                'Projector' => '5,000 Lm', 'Projection' => '87"-138"', 'Control' => 'Built-in tablet', 'Warranty' => '5 years']],
                        ],
                    ]],
                    ['layout' => 'games_gallery', 'fields' => [
                        'title' => 'Floor projector games',
                        'game_slugs' => [ ['slug' => 'unknown-planet-2'] ],
                        'limit' => 6,
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Adjustable projection?', 'answer' => 'Yes, from 78x44 up to 131x74 inches.'],
                            ['question' => 'Ceiling install needed?', 'answer' => 'No, it is fully mobile.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'interactive-sandbox',
                'title' => 'Interactive AR Sandbox',
                'type' => 'product_landing',
                'product_slug' => 'interactive-sandbox',
                'status' => 'published',
                'seo_title' => 'AR Sandbox',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive AR Sandbox',
                        'subtitle' => 'Where imagination meets reality',
                        'badge' => '100+ reviews',
                        'primary_cta_label' => 'Get a Quote',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'comparison_table', 'fields' => [
                        'title' => 'Compare sandboxes',
                        'variants' => [
                            ['name' => 'AR Sandbox', 'price' => '$11,200', 'specs' => [
                                'Projector' => '4,500 Lm', 'Projection' => '55" x 42" x 7"', 'Skins' => 'Ocean, Safari, Solid, Dino', 'Warranty' => '2 years']],
                            ['name' => 'Commercial AR Sandbox 2-in-1', 'price' => '$16,999', 'specs' => [
                                'Projector' => '6,200 Lm', 'Projection' => '75" x 45" x 7"', 'Skins' => 'Ocean, Safari, Solid, Dino', 'Warranty' => '5 years']],
                        ],
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Какой песок используется?', 'answer' => 'Специальный безпыльный SensorySand.'],
                            ['question' => 'Есть ли звук?', 'answer' => 'Да, звук встроен.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'special-needs',
                'title' => 'Special Needs',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive solutions for special needs',
                        'subtitle' => 'Sensory-friendly interactive rooms and devices',
                        'primary_cta_label' => 'Schedule a demo',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'use_cases', 'fields' => [
                        'items' => [
                            ['heading' => 'Therapy centers', 'body' => 'Movement-based games to improve coordination.'],
                            ['heading' => 'Schools & SPED', 'body' => 'Approved by teachers and therapists.'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Interactive Floor', 'subtitle' => 'Movement & learning', 'url' => '/interactive-floor/'],
                            ['title' => 'AR Sandbox', 'subtitle' => 'Sensory play', 'url' => '/interactive-sandbox/'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'custom-software-development',
                'title' => 'Custom Software Development',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Custom interactive games',
                        'subtitle' => 'Tailored experiences for your venue',
                        'primary_cta_label' => 'Discuss project',
                        'primary_cta_url' => '/contact/',
                    ]],
                    ['layout' => 'use_cases', 'fields' => [
                        'items' => [
                            ['heading' => 'Brand activations', 'body' => 'Custom games for fairs and exhibitions.'],
                            ['heading' => 'Education', 'body' => 'Curriculum-aligned interactive content.'],
                        ],
                    ]],
                    ['layout' => 'news_list', 'fields' => [
                        'title' => 'Related cases',
                        'filters' => ['types' => 'case_study', 'limit' => '3'],
                    ]],
                ],
            ],
            [
                'slug' => 'sensory-room',
                'title' => 'Sensory Room',
                'type' => 'static',
                'status' => 'published',
                'seo_title' => 'Sensory Room Solutions',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Sensory Rooms tailored to unique needs',
                        'subtitle' => 'Interactive environments for therapy and calming spaces',
                        'primary_cta_label' => 'Book a live demo',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => 'Calming projection', 'text' => 'Immersive visuals to regulate senses'],
                            ['heading' => 'Movement & play', 'text' => 'Floor, wall, and sandbox for engagement'],
                            ['heading' => 'No subscriptions', 'text' => 'Free updates, lifetime support'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Interactive Floor', 'subtitle' => 'Movement + learning', 'url' => '/interactive-floor/'],
                            ['title' => 'AR Sandbox', 'subtitle' => 'Tactile + visual', 'url' => '/interactive-sandbox/'],
                            ['title' => 'Interactive Wall', 'subtitle' => 'Throw & learn', 'url' => '/interactive-throw-wall/'],
                        ],
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Подходит ли для СПО и терапии?', 'answer' => 'Да, используется в сенсорных комнатах и одобрено педагогами.'],
                            ['question' => 'Требуются ли подписки?', 'answer' => 'Нет, ПО обновляется бесплатно.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'interactive-digital-parks',
                'title' => 'Interactive Digital Parks',
                'type' => 'static',
                'status' => 'published',
                'seo_title' => 'Digital Parks',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Build an interactive digital park',
                        'subtitle' => 'Floor, wall, sandbox, swing, slide — turnkey attractions',
                        'primary_cta_label' => 'Plan a project',
                        'primary_cta_url' => '/contact/',
                    ]],
                    ['layout' => 'use_cases', 'fields' => [
                        'items' => [
                            ['heading' => 'Amusement venues', 'body' => 'Install multi-zone interactive attractions.'],
                            ['heading' => 'Pop-up installations', 'body' => 'Fast deploy, mobile equipment available.'],
                            ['heading' => 'Education parks', 'body' => 'STEM/STEAM journeys with AR/VR-style play.'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Mobile Interactive Floor', 'subtitle' => 'Quick deploy, no ceiling install', 'url' => '/interactive-floor-mobil/'],
                            ['title' => 'Interactive Wall', 'subtitle' => 'Immersive throw & catch', 'url' => '/interactive-throw-wall/'],
                            ['title' => 'Interactive Sandbox', 'subtitle' => 'AR terrain & themed skins', 'url' => '/interactive-sandbox/'],
                        ],
                    ]],
                    ['layout' => 'logos', 'fields' => [
                        'title' => 'Trusted by venues',
                        'logos' => [
                            ['image' => 'https://kidsjumptech.com/wp-content/uploads/2024/01/Logos.jpg', 'alt' => 'Clients'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'interactive-playground',
                'title' => 'Interactive Playground',
                'type' => 'static',
                'status' => 'published',
                'seo_title' => 'Interactive Playground Solutions',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Playground',
                        'subtitle' => 'Turnkey interactive playground creation',
                        'primary_cta_label' => 'Get a quote',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => 'Turnkey', 'text' => 'Design, hardware, content, support'],
                            ['heading' => 'Safe & mobile', 'text' => 'Ceiling-free options available'],
                            ['heading' => 'Educational', 'text' => 'Games for motor skills and learning'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Interactive Slide', 'url' => '/interactive-slider/'],
                            ['title' => 'Interactive Swing', 'url' => '/interactive-swing/'],
                            ['title' => 'Interactive Ball Wall', 'url' => '/mobile-interactive-ball-wall/'],
                        ],
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Можно ли ставить на улице?', 'answer' => 'Оборудование рассчитано на помещения; для улицы требуется укрытие.'],
                            ['question' => 'Как обслуживать?', 'answer' => 'Плановое обслуживание и удалённая поддержка входят.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'product-support',
                'title' => 'Product Support',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Product Support',
                        'subtitle' => '24/7 remote support and training',
                        'primary_cta_label' => 'Contact support',
                        'primary_cta_url' => '/contact/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => '24/7 remote', 'text' => 'Assistance and diagnostics'],
                            ['heading' => 'Free updates', 'text' => 'Software updates included'],
                            ['heading' => 'Training', 'text' => 'Onboarding for your staff'],
                        ],
                    ]],
                    ['layout' => 'faq', 'fields' => [
                        'title' => 'FAQ',
                        'items' => [
                            ['question' => 'Как связаться ночью?', 'answer' => 'Доступен удалённый саппорт 24/7.'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'school-equipment',
                'title' => 'Interactive Equipment for Schools',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Equipment for Schools',
                        'subtitle' => 'Interactive floor, wall, sandbox for education',
                        'primary_cta_label' => 'Talk to sales',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'use_cases', 'fields' => [
                        'items' => [
                            ['heading' => 'Preschools & K-12', 'body' => 'Motor skills, math, reading games'],
                            ['heading' => 'PE & SEL', 'body' => 'Movement-based activities for groups'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Interactive Floor', 'url' => '/interactive-floor/'],
                            ['title' => 'Mobile Floor', 'url' => '/interactive-floor-mobil/'],
                            ['title' => 'AR Sandbox', 'url' => '/interactive-sandbox/'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'hospital-equipment',
                'title' => 'Interactive Equipment for Hospitals',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Equipment for Hospitals',
                        'subtitle' => 'Engaging rehab and sensory-friendly play',
                        'primary_cta_label' => 'Schedule a demo',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'icon_bullets', 'fields' => [
                        'items' => [
                            ['heading' => 'Therapy focused', 'text' => 'Movement, coordination, focus'],
                            ['heading' => 'Mobile options', 'text' => 'No ceiling install required'],
                            ['heading' => 'Hygiene-friendly', 'text' => 'Easy-to-clean mats and cases'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Mobile Interactive Floor', 'url' => '/interactive-floor-mobil/'],
                            ['title' => 'Interactive Wall', 'url' => '/interactive-throw-wall/'],
                            ['title' => 'Interactive Sandbox', 'url' => '/interactive-sandbox/'],
                        ],
                    ]],
                ],
            ],
            [
                'slug' => 'interactive-equipment-for-church',
                'title' => 'Interactive Equipment for Church',
                'type' => 'static',
                'status' => 'published',
                'blocks' => [
                    ['layout' => 'hero', 'fields' => [
                        'title' => 'Interactive Equipment for Church',
                        'subtitle' => 'Engage kids during programs and events',
                        'primary_cta_label' => 'Get a quote',
                        'primary_cta_url' => '/live-demo/',
                    ]],
                    ['layout' => 'use_cases', 'fields' => [
                        'items' => [
                            ['heading' => 'Sunday school', 'body' => 'Interactive games to support lessons'],
                            ['heading' => 'Community events', 'body' => 'Mobile floor for multipurpose rooms'],
                        ],
                    ]],
                    ['layout' => 'product_cards', 'fields' => [
                        'items' => [
                            ['title' => 'Mobile Interactive Floor', 'url' => '/interactive-floor-mobil/'],
                            ['title' => 'Interactive Wall', 'url' => '/interactive-throw-wall/'],
                        ],
                    ]],
                ],
            ],
        ];

        // Normalize blocks to MoonShine Layouts format {name, key, values}
        $pages = collect($pages)
            ->map(function (array $page) {
                $page['blocks'] = collect($page['blocks'] ?? [])
                    ->values()
                    ->map(function (array $block, int $index) {
                        $name = $block['layout'] ?? $block['name'] ?? $block['type'] ?? 'custom';
                        $values = $block['fields'] ?? $block['values'] ?? [];

                        return [
                            'key' => $block['key'] ?? $index,
                            'name' => $name,
                            'values' => $values,
                        ];
                    })
                    ->toArray();

                return $page;
            })
            ->toArray();

        foreach ($pages as $pageData) {
            $productId = null;
            if (!empty($pageData['product_slug'])) {
                $productId = Product::where('slug', $pageData['product_slug'])->value('id');
            }

            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                [
                    'title' => $pageData['title'],
                    'type' => $pageData['type'],
                    'product_id' => $productId,
                    'status' => $pageData['status'],
                    'seo_title' => $pageData['seo_title'] ?? null,
                    'blocks' => $pageData['blocks'],
                    'published_at' => $now,
                ]
            );
        }

        // Forms -----------------------------------------------
        Form::updateOrCreate(
            ['code' => 'live_demo'],
            [
                'title' => 'Live Demo',
                'config' => [
                    'fields' => [
                        ['name' => 'full_name', 'label' => 'Full Name', 'type' => 'text', 'required' => true],
                        ['name' => 'phone', 'label' => 'Phone Number', 'type' => 'phone', 'required' => true],
                        ['name' => 'email', 'label' => 'Email Address', 'type' => 'email', 'required' => true],
                        [
                            'name' => 'preferred_contact',
                            'label' => 'Preferred Method of Communication',
                            'type' => 'checkbox',
                            'options' => [
                                'call' => 'Call',
                                'whatsapp' => 'WhatsApp',
                                'email' => 'E-mail',
                                'text' => 'Text Message',
                            ],
                        ],
                        [
                            'name' => 'organization_type',
                            'label' => 'Type of Organization',
                            'type' => 'select',
                            'options' => [
                                'sensory_room' => 'Sensory room',
                                'school' => 'School',
                                'therapy_center' => 'Therapy center',
                                'hospital' => 'Hospital',
                                'home_use' => 'Home use',
                                'other' => 'Other',
                            ],
                        ],
                        [
                            'name' => 'special_needs',
                            'label' => 'Is it for special needs?',
                            'type' => 'select',
                            'required' => true,
                            'options' => [
                                'yes' => 'Yes',
                                'no' => 'No',
                            ],
                        ],
                        ['name' => 'remarks', 'label' => 'Remarks', 'type' => 'textarea'],
                    ],
                ],
            ]
        );
    }
}
