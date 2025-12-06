<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MoonShine\Layouts\Casts\LayoutsCast;
use App\Models\Product;
use App\Models\PageBlocks\FaqItem;
use App\Models\PageBlocks\FeatureGridItem;
use App\Models\PageBlocks\GamesGalleryFilter;
use App\Models\PageBlocks\GamesGridFilter;
use App\Models\PageBlocks\HeroSlide;
use App\Models\PageBlocks\HeroValueItem;
use App\Models\PageBlocks\InteractiveShowcaseItem;
use App\Models\PageBlocks\NewsFilter;
use App\Models\PageBlocks\ProductCarouselFilter;
use App\Models\PageBlocks\ProductHeroBadge;
use App\Models\PageBlocks\ProductNavItem;
use App\Models\PageBlocks\ProductSpecTab;
use App\Models\PageBlocks\ReviewItem;
use App\Models\PageBlocks\StatItem;

class Page extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'blocks' => LayoutsCast::class,
            'published_at' => 'datetime',
        ];
    }

    protected $appends = [
        'blocks_array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function heroSlides()
    {
        return $this->hasMany(HeroSlide::class)
            ->where('block_key', HeroSlide::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function heroValueItems()
    {
        return $this->hasMany(HeroValueItem::class)
            ->where('block_key', HeroValueItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function productNavItems()
    {
        return $this->hasMany(ProductNavItem::class)
            ->where('block_key', ProductNavItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function interactiveShowcaseItems()
    {
        return $this->hasMany(InteractiveShowcaseItem::class)
            ->where('block_key', InteractiveShowcaseItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function productHeroBadges()
    {
        return $this->hasMany(ProductHeroBadge::class)
            ->where('block_key', ProductHeroBadge::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function productSpecTabs()
    {
        return $this->hasMany(ProductSpecTab::class)
            ->where('block_key', ProductSpecTab::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function featureGridItems()
    {
        return $this->hasMany(FeatureGridItem::class)
            ->where('block_key', FeatureGridItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function productCarouselFilters()
    {
        return $this->hasMany(ProductCarouselFilter::class)
            ->where('block_key', ProductCarouselFilter::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function gamesGalleryFilters()
    {
        return $this->hasMany(GamesGalleryFilter::class)
            ->where('block_key', GamesGalleryFilter::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function gamesGridFilters()
    {
        return $this->hasMany(GamesGridFilter::class)
            ->where('block_key', GamesGridFilter::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function newsFilters()
    {
        return $this->hasMany(NewsFilter::class)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function statItems()
    {
        return $this->hasMany(StatItem::class)
            ->where('block_key', StatItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function faqItems()
    {
        return $this->hasMany(FaqItem::class)
            ->where('block_key', FaqItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function reviewItems()
    {
        return $this->hasMany(ReviewItem::class)
            ->where('block_key', ReviewItem::BLOCK_KEY)
            ->orderBy('block_index')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function getBlocksArrayAttribute(): mixed
    {
        $blocks = $this->blocks;

        if (is_object($blocks) && method_exists($blocks, 'toArray')) {
            $blocks = $blocks->toArray();
        }

        if (is_array($blocks)) {
            return collect($blocks)->map(function ($item) {
                if (is_object($item) && method_exists($item, 'toArray')) {
                    $item = $item->toArray();
                }
                if ($item instanceof \JsonSerializable) {
                    $item = $item->jsonSerialize();
                }
                return $item;
            })->toArray();
        }

        return $blocks;
    }
}
