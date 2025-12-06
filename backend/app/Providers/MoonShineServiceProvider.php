<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use MoonShine\Contracts\Core\DependencyInjection\CoreContract;
use MoonShine\Laravel\DependencyInjection\MoonShine;
use MoonShine\Laravel\DependencyInjection\MoonShineConfigurator;
use App\MoonShine\Resources\MoonShineUser\MoonShineUserResource;
use App\MoonShine\Resources\MoonShineUserRole\MoonShineUserRoleResource;
use App\MoonShine\Resources\Page\PageResource;
use App\MoonShine\Resources\PageBlock\FaqItemResource;
use App\MoonShine\Resources\PageBlock\FeatureGridItemResource;
use App\MoonShine\Resources\PageBlock\GamesGalleryFilterResource;
use App\MoonShine\Resources\PageBlock\GamesGridFilterResource;
use App\MoonShine\Resources\PageBlock\HeroSlideResource;
use App\MoonShine\Resources\PageBlock\HeroValueItemResource;
use App\MoonShine\Resources\PageBlock\InteractiveShowcaseFeatureResource;
use App\MoonShine\Resources\PageBlock\InteractiveShowcaseGalleryItemResource;
use App\MoonShine\Resources\PageBlock\InteractiveShowcaseItemResource;
use App\MoonShine\Resources\PageBlock\NewsFilterResource;
use App\MoonShine\Resources\PageBlock\ProductCarouselFilterResource;
use App\MoonShine\Resources\PageBlock\ProductHeroBadgeResource;
use App\MoonShine\Resources\PageBlock\ProductNavItemResource;
use App\MoonShine\Resources\PageBlock\ProductSpecTabResource;
use App\MoonShine\Resources\PageBlock\ReviewItemResource;
use App\MoonShine\Resources\PageBlock\StatItemResource;
use App\MoonShine\Resources\Article\ArticleResource;
use App\MoonShine\Resources\ArticleCategory\ArticleCategoryResource;
use App\MoonShine\Resources\Game\GameResource;
use App\MoonShine\Resources\GameCategory\GameCategoryResource;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use App\MoonShine\Resources\StoreProduct\StoreProductResource;
use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;
use App\MoonShine\Resources\StoreCategory\StoreCategoryResource;
use App\MoonShine\Resources\Industry\IndustryResource;
use App\MoonShine\Resources\Form\FormResource;
use App\MoonShine\Resources\Lead\LeadResource;
use App\MoonShine\Resources\Menu\MenuResource;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use App\MoonShine\Resources\Review\ReviewResource;

class MoonShineServiceProvider extends ServiceProvider
{
    /**
     * @param  CoreContract<MoonShineConfigurator>  $core
     */
    public function boot(CoreContract $core): void
    {
        $core
            ->resources([
                MoonShineUserResource::class,
                MoonShineUserRoleResource::class,
                PageResource::class,
                HeroSlideResource::class,
                HeroValueItemResource::class,
                ProductNavItemResource::class,
                InteractiveShowcaseItemResource::class,
                InteractiveShowcaseFeatureResource::class,
                InteractiveShowcaseGalleryItemResource::class,
                ProductHeroBadgeResource::class,
                ProductSpecTabResource::class,
                FeatureGridItemResource::class,
                ProductCarouselFilterResource::class,
                GamesGalleryFilterResource::class,
                GamesGridFilterResource::class,
                NewsFilterResource::class,
                StatItemResource::class,
                FaqItemResource::class,
                ReviewItemResource::class,
                ArticleResource::class,
                ArticleCategoryResource::class,
                GameResource::class,
                GameCategoryResource::class,
                ProductResource::class,
                ProductVariantResource::class,
                StoreProductResource::class,
                TrustedLogoResource::class,
                StoreCategoryResource::class,
                IndustryResource::class,
                FormResource::class,
                LeadResource::class,
                MenuResource::class,
                MenuItemResource::class,
                ReviewResource::class,
            ])
            ->pages([
                ...$core->getConfig()->getPages(),
            ])
        ;
    }
}
