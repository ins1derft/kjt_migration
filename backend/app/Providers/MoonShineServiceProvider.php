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
use App\MoonShine\Resources\Article\ArticleResource;
use App\MoonShine\Resources\ArticleCategory\ArticleCategoryResource;
use App\MoonShine\Resources\Game\GameResource;
use App\MoonShine\Resources\GameCategory\GameCategoryResource;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use App\MoonShine\Resources\StoreProduct\StoreProductResource;
use App\MoonShine\Resources\StoreCategory\StoreCategoryResource;
use App\MoonShine\Resources\Industry\IndustryResource;
use App\MoonShine\Resources\Form\FormResource;
use App\MoonShine\Resources\Lead\LeadResource;

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
                ArticleResource::class,
                ArticleCategoryResource::class,
                GameResource::class,
                GameCategoryResource::class,
                ProductResource::class,
                ProductVariantResource::class,
                StoreProductResource::class,
                StoreCategoryResource::class,
                IndustryResource::class,
                FormResource::class,
                LeadResource::class,
            ])
            ->pages([
                ...$core->getConfig()->getPages(),
            ])
        ;
    }
}
