<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $page = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('slug', 'product-support')
            ->first();

        $newBlock = [
            'name' => 'feature_grid_intro',
            'key' => 1,
            'values' => [
                'title' => 'Product Support',
                'description' => 'Our support department comprises well-trained individuals ready to assist with various tasks. We promptly handle the setup of one, multiple products, or even an entire interactive park.',
                'items' => [
                    [
                        'title' => 'Average Response Time',
                        'description' => '5-10 minutes',
                        'icon' => '/images/product-support/icon-response.svg',
                        'iconAlt' => 'Average response time icon',
                    ],
                    [
                        'title' => 'Problem Resolution Time',
                        'description' => '10-20 minutes',
                        'icon' => '/images/product-support/icon-resolution.svg',
                        'iconAlt' => 'Problem resolution icon',
                    ],
                    [
                        'title' => 'Work Schedule',
                        'description' => '24/7',
                        'icon' => '/images/product-support/icon-schedule.svg',
                        'iconAlt' => 'Work schedule icon',
                    ],
                ],
                'gridTitle' => 'How Technical Support Works',
                'secondaryDescription' => 'If you need technical support, simply give us a call, and we\'ll respond. Let us know about the issue so we can provide you with the best service!',
                'secondaryItems' => [
                    [
                        'description' => '<span class=\"text-brand-sky\">(877) 901-0110</span><br/>(Toll free number)',
                        'icon' => '/images/product-support/icon-phone.svg',
                        'iconAlt' => 'Phone icon',
                    ],
                    [
                        'description' => '<span class=\"text-brand-sky\">+1 (786) 968-5878</span><br/>(WhatsApp number for outside of US inquiries)',
                        'icon' => '/images/product-support/icon-phone.svg',
                        'iconAlt' => 'Phone icon',
                    ],
                ],
                'footerText' => '<p>You don\'t need to make a formal request, etc. - we strive to make it convenient for you first and foremost.</p><p>If it\'s easier for you to write about the issue, please use the feedback form. Additionally, you can provide the model of your device and any other details you deem important.</p><p>Most technical issues we solve over the phone; in some cases, TeamViewer might be needed.</p>',
                'padding' => null,
                'backgroundColor' => null,
                'backgroundClass' => null,
            ],
        ];

        if (!$page) {
            DB::table('pages')->insert([
                'slug' => 'product-support',
                'title' => 'Product Support',
                'type' => 'static',
                'status' => 'published',
                'blocks' => json_encode([$newBlock], JSON_UNESCAPED_UNICODE),
                'seo_title' => 'Round-The-Clock Technical Support - Your Partner for Success',
                'seo_description' => 'Our team of specialists is ready to help 7 days a week. We guarantee uninterrupted operation of your equipment and software.',
                'seo_canonical' => 'https://kidsjumptech.com/product-support/',
                'seo_og_image' => null,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return;
        }

        $blocks = $page->blocks;

        if (is_string($blocks)) {
            $decoded = json_decode($blocks, true);
            $blocks = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($blocks)) {
            $blocks = [];
        }

        $alreadyExists = collect($blocks)->contains(function ($block) {
            return is_array($block) && ($block['name'] ?? null) === 'feature_grid_intro';
        });

        if ($alreadyExists) {
            return;
        }

        $maxKey = collect($blocks)
            ->map(fn ($block) => is_array($block) ? ($block['key'] ?? null) : null)
            ->filter(fn ($key) => is_numeric($key))
            ->map(fn ($key) => (int) $key)
            ->max();

        $newBlock['key'] = ($maxKey ?? 0) + 1;

        $blocks[] = $newBlock;

        DB::table('pages')
            ->where('id', $page->id)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            ]);
    }

    public function down(): void
    {
        $page = DB::table('pages')
            ->select(['id', 'blocks'])
            ->where('slug', 'product-support')
            ->first();

        if (!$page) {
            return;
        }

        $blocks = $page->blocks;

        if (is_string($blocks)) {
            $decoded = json_decode($blocks, true);
            $blocks = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($blocks)) {
            $blocks = [];
        }

        $blocks = collect($blocks)
            ->filter(function ($block) {
                return !(is_array($block) && ($block['name'] ?? null) === 'feature_grid_intro');
            })
            ->values()
            ->all();

        if (empty($blocks)) {
            DB::table('pages')
                ->where('id', $page->id)
                ->delete();
            return;
        }

        DB::table('pages')
            ->where('id', $page->id)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
            ]);
    }
};
