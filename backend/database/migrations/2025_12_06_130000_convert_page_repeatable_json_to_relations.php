<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('video_id')->nullable();
            $table->string('alt')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('hero_value_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('product_nav_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('label')->nullable();
            $table->string('anchor')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('interactive_showcase_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('title')->nullable();
            $table->string('product_page_slug')->nullable();
            $table->text('description')->nullable();
            $table->string('hashtag')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_href')->nullable();
            $table->string('form_code')->nullable();
            $table->string('video_id')->nullable();
            $table->string('video_poster')->nullable();
            $table->string('video_alt')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('interactive_showcase_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interactive_showcase_item_id')->constrained()->cascadeOnDelete();
            $table->string('icon')->nullable();
            $table->string('label')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('interactive_showcase_gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interactive_showcase_item_id')->constrained()->cascadeOnDelete();
            $table->string('src')->nullable();
            $table->string('alt')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('product_hero_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('image')->nullable();
            $table->string('label')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('product_spec_tabs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('key')->nullable();
            $table->string('label')->nullable();
            $table->string('image')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('feature_grid_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('product_carousel_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('field')->nullable();
            $table->string('value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('games_gallery_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('field')->nullable();
            $table->string('value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('games_grid_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('field')->nullable();
            $table->string('value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('news_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('field')->nullable();
            $table->string('value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('stat_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('value')->nullable();
            $table->string('label')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('faq_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('question')->nullable();
            $table->text('answer')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('reviews_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_key')->index();
            $table->unsignedInteger('block_index')->default(0);
            $table->string('name')->nullable();
            $table->string('date')->nullable();
            $table->unsignedTinyInteger('rating')->nullable();
            $table->text('text')->nullable();
            $table->string('avatar')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        DB::transaction(function () {
            $pages = DB::table('pages')->select('id', 'blocks')->get();

            foreach ($pages as $page) {
                $blocks = $this->decodeBlocks($page->blocks);

                foreach ($blocks as $blockIndex => $block) {
                    $name = $block['name'] ?? null;
                    if (!$name) {
                        continue;
                    }

                    $values = $this->toArray($block['values'] ?? []);
                    $index = $this->normalizeIndex($block['key'] ?? $blockIndex);
                    $now = now();

                    switch ($name) {
                        case 'hero':
                            $slides = $this->normalizeArray($values['slides'] ?? []);
                            foreach ($slides as $pos => $slide) {
                                $slide = $this->toArray($slide);
                                DB::table('hero_slides')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'hero',
                                    'block_index' => $index,
                                    'video_id' => $slide['videoId'] ?? null,
                                    'alt' => $slide['alt'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'hero_values':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('hero_value_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'hero_values',
                                    'block_index' => $index,
                                    'title' => $item['title'] ?? null,
                                    'description' => $item['description'] ?? null,
                                    'icon' => $item['icon'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'product_nav':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('product_nav_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'product_nav',
                                    'block_index' => $index,
                                    'label' => $item['label'] ?? null,
                                    'anchor' => $item['anchor'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'interactive_header':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                $itemId = DB::table('interactive_showcase_items')->insertGetId([
                                    'page_id' => $page->id,
                                    'block_key' => 'interactive_header',
                                    'block_index' => $index,
                                    'title' => $item['title'] ?? null,
                                    'product_page_slug' => $item['productPageSlug'] ?? null,
                                    'description' => $item['description'] ?? null,
                                    'hashtag' => $item['hashtag'] ?? null,
                                    'cta_label' => $item['ctaLabel'] ?? null,
                                    'cta_href' => $item['ctaHref'] ?? null,
                                    'form_code' => $item['formCode'] ?? null,
                                    'video_id' => $item['videoId'] ?? null,
                                    'video_poster' => $item['videoPoster'] ?? null,
                                    'video_alt' => $item['videoAlt'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);

                                $features = $this->normalizeArray($item['features'] ?? []);
                                foreach ($features as $featurePos => $feature) {
                                    $feature = $this->toArray($feature);
                                    DB::table('interactive_showcase_features')->insert([
                                        'interactive_showcase_item_id' => $itemId,
                                        'icon' => $feature['icon'] ?? null,
                                        'label' => $feature['label'] ?? null,
                                        'position' => $featurePos,
                                        'created_at' => $now,
                                        'updated_at' => $now,
                                    ]);
                                }

                                $gallery = $this->normalizeArray($item['gallery'] ?? []);
                                foreach ($gallery as $galleryPos => $media) {
                                    $media = $this->toArray($media);
                                    DB::table('interactive_showcase_gallery_items')->insert([
                                        'interactive_showcase_item_id' => $itemId,
                                        'src' => $media['src'] ?? null,
                                        'alt' => $media['alt'] ?? null,
                                        'position' => $galleryPos,
                                        'created_at' => $now,
                                        'updated_at' => $now,
                                    ]);
                                }
                            }
                            break;
                        case 'product_hero':
                            $badges = $this->normalizeArray($values['badges'] ?? []);
                            foreach ($badges as $pos => $badge) {
                                $badge = $this->toArray($badge);
                                DB::table('product_hero_badges')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'product_hero',
                                    'block_index' => $index,
                                    'image' => $badge['image'] ?? null,
                                    'label' => $badge['label'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'product_specs':
                            $tabs = $this->normalizeArray($values['tabs'] ?? []);
                            foreach ($tabs as $pos => $tab) {
                                $tab = $this->toArray($tab);
                                DB::table('product_spec_tabs')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'product_specs',
                                    'block_index' => $index,
                                    'key' => $tab['key'] ?? null,
                                    'label' => $tab['label'] ?? null,
                                    'image' => $tab['image'] ?? null,
                                    'title' => $tab['title'] ?? null,
                                    'description' => $tab['description'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'feature_grid':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('feature_grid_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'feature_grid',
                                    'block_index' => $index,
                                    'title' => $item['title'] ?? null,
                                    'description' => $item['description'] ?? null,
                                    'icon' => $item['icon'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'product_carousel':
                            $filters = $this->normalizeArray(data_get($values, 'query.filter', []));
                            foreach ($filters as $pos => $filter) {
                                $filter = $this->toArray($filter);
                                DB::table('product_carousel_filters')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'product_carousel',
                                    'block_index' => $index,
                                    'field' => $filter['field'] ?? null,
                                    'value' => $filter['value'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'games_gallery':
                            $filters = $this->normalizeArray(data_get($values, 'query.filter', []));
                            foreach ($filters as $pos => $filter) {
                                $filter = $this->toArray($filter);
                                DB::table('games_gallery_filters')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'games_gallery',
                                    'block_index' => $index,
                                    'field' => $filter['field'] ?? null,
                                    'value' => $filter['value'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'games_grid':
                            $filters = $this->normalizeArray(data_get($values, 'query.filter', []));
                            foreach ($filters as $pos => $filter) {
                                $filter = $this->toArray($filter);
                                DB::table('games_grid_filters')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'games_grid',
                                    'block_index' => $index,
                                    'field' => $filter['field'] ?? null,
                                    'value' => $filter['value'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'news':
                        case 'news_list':
                            $filters = $this->normalizeArray(data_get($values, 'query.filter', []));
                            $blockKey = $name;
                            foreach ($filters as $pos => $filter) {
                                $filter = $this->toArray($filter);
                                DB::table('news_filters')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => $blockKey,
                                    'block_index' => $index,
                                    'field' => $filter['field'] ?? null,
                                    'value' => $filter['value'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'stats':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('stat_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'stats',
                                    'block_index' => $index,
                                    'value' => $item['value'] ?? null,
                                    'label' => $item['label'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'faq':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('faq_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'faq',
                                    'block_index' => $index,
                                    'question' => $item['question'] ?? null,
                                    'answer' => $item['answer'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        case 'reviews':
                            $items = $this->normalizeArray($values['items'] ?? []);
                            foreach ($items as $pos => $item) {
                                $item = $this->toArray($item);
                                DB::table('reviews_items')->insert([
                                    'page_id' => $page->id,
                                    'block_key' => 'reviews',
                                    'block_index' => $index,
                                    'name' => $item['name'] ?? null,
                                    'date' => $item['date'] ?? null,
                                    'rating' => $item['rating'] ?? null,
                                    'text' => $item['text'] ?? null,
                                    'avatar' => $item['avatar'] ?? null,
                                    'position' => $pos,
                                    'created_at' => $now,
                                    'updated_at' => $now,
                                ]);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews_items');
        Schema::dropIfExists('faq_items');
        Schema::dropIfExists('stat_items');
        Schema::dropIfExists('news_filters');
        Schema::dropIfExists('games_grid_filters');
        Schema::dropIfExists('games_gallery_filters');
        Schema::dropIfExists('product_carousel_filters');
        Schema::dropIfExists('feature_grid_items');
        Schema::dropIfExists('product_spec_tabs');
        Schema::dropIfExists('product_hero_badges');
        Schema::dropIfExists('interactive_showcase_gallery_items');
        Schema::dropIfExists('interactive_showcase_features');
        Schema::dropIfExists('interactive_showcase_items');
        Schema::dropIfExists('product_nav_items');
        Schema::dropIfExists('hero_value_items');
        Schema::dropIfExists('hero_slides');
    }

    private function decodeBlocks(mixed $raw): array
    {
        if (empty($raw)) {
            return [];
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            return is_array($decoded) ? $decoded : [];
        }

        return is_array($raw) ? $raw : [];
    }

    private function normalizeArray(mixed $value): array
    {
        if (is_array($value)) {
            return array_values($value);
        }

        return [];
    }

    private function toArray(mixed $value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (is_object($value)) {
            return (array) $value;
        }

        return [];
    }

    private function normalizeIndex(mixed $index): int
    {
        if (is_numeric($index)) {
            return (int) $index;
        }

        return 0;
    }
};
