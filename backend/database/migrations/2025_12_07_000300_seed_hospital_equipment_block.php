<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        $slug = 'hospital-equipment';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $hasBlock = collect($blocks)->contains(fn ($block) => Arr::get($block, 'name') === 'hospital_equipment');

        if ($hasBlock) {
            return;
        }

        $newBlock = [
            'name' => 'hospital_equipment',
            'values' => [
                'title' => 'The Benefits of Interactive Equipment in Hospitals',
                'features' => [
                    [
                        'title' => 'It improves psycho-emotional well-being',
                        'description' => 'which plays a crucial role in the recovery process. Children immersed in a positive and stimulating environment often feel better and recover faster.',
                        'icon' => '/images/hospital-equipment/feature-1.png',
                    ],
                    [
                        'title' => 'Carefully designed educational scenarios help children continue learning even during treatment.',
                        'description' => 'In a playful way, children can explore various scientific phenomena, geography, history, and more.',
                        'icon' => '/images/hospital-equipment/feature-2.png',
                    ],
                    [
                        'title' => 'Interactive equipment enhances the social aspect,',
                        'description' => 'encouraging children to communicate and play together. This is especially important for those spending extended time in the hospital.',
                        'icon' => '/images/hospital-equipment/feature-3.png',
                    ],
                    [
                        'title' => 'Using interactive equipment can be part of physiotherapy.',
                        'description' => 'Creating different landscape elements, throwing balls, jumping across active projection features, and other active games require a certain level of physical activity. This promotes motor skill development and recovery from certain illnesses or injuries.',
                        'icon' => '/images/hospital-equipment/feature-4.png',
                    ],
                ],
                'ctaTitle' => 'Interested in learning more about our equipment?',
                'ctaGradient' => "Get\u{00A0}in\u{00A0}touch\u{00A0}with\u{00A0}us.",
                'ctaLabel' => 'Schedule A Consultation',
                'ctaHref' => 'mailto:info@kidsjumptech.com?subject=Consultation',
                'ctaBackground' => '/images/hospital-equipment/cta-bg.jpg',
                'footerTitle' => 'Comprehensive Delivery',
                'footerDescription' => 'We not only offer prompt delivery to any U.S. state but also provide comprehensive and staff training at no extra cost. This approach helps minimize customer expenses by eliminating the need for additional services.',
                'footerIcon' => '/images/hospital-equipment/rocket.svg',
            ],
        ];

        array_unshift($blocks, $newBlock);

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($blocks, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }

    public function down(): void
    {
        $slug = 'hospital-equipment';

        $page = DB::table('pages')->where('slug', $slug)->first();
        if (! $page) {
            return;
        }

        $blocks = json_decode($page->blocks ?? '[]', true) ?? [];
        $filtered = array_values(array_filter($blocks, fn ($block) => Arr::get($block, 'name') !== 'hospital_equipment'));

        DB::table('pages')
            ->where('slug', $slug)
            ->update([
                'blocks' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
    }
};
