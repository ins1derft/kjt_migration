<?php

declare(strict_types=1);

namespace App\MoonShine\Layouts;

use MoonShine\AssetManager\Js;
use MoonShine\Laravel\Layouts\AppLayout;
use MoonShine\ColorManager\Palettes\PurplePalette;
use MoonShine\ColorManager\ColorManager;
use MoonShine\Contracts\ColorManager\ColorManagerContract;
use MoonShine\Contracts\ColorManager\PaletteContract;
use MoonShine\MenuManager\MenuItem;
use App\MoonShine\Resources\Page\PageResource;
use App\MoonShine\Resources\Article\ArticleResource;
use App\MoonShine\Resources\ArticleCategory\ArticleCategoryResource;
use App\MoonShine\Resources\Game\GameResource;
use App\MoonShine\Resources\GameCategory\GameCategoryResource;
use App\MoonShine\Resources\Product\ProductResource;
use App\MoonShine\Resources\ProductAttribute\ProductAttributeResource;
use App\MoonShine\Resources\ProductVariant\ProductVariantResource;
use App\MoonShine\Resources\StoreProduct\StoreProductResource;
use App\MoonShine\Resources\TrustedLogo\TrustedLogoResource;
use App\MoonShine\Resources\StoreCategory\StoreCategoryResource;
use App\MoonShine\Resources\Form\FormResource;
use App\MoonShine\Resources\Lead\LeadResource;
use App\MoonShine\Resources\Menu\MenuResource;
use App\MoonShine\Resources\MenuItem\MenuItemResource;
use App\MoonShine\Resources\Review\ReviewResource;
use App\MoonShine\Resources\SiteSettings\SiteSettingsResource;
use App\MoonShine\Resources\TeamMember\TeamMemberResource;

final class MoonShineLayout extends AppLayout
{
    /**
     * @var null|class-string<PaletteContract>
     */
    protected ?string $palette = PurplePalette::class;

    protected function assets(): array
    {
        return [
            ...parent::assets(),
            Js::make('/vendor/kjt/layouts-clipboard.js'),
        ];
    }

    protected function menu(): array
    {
        return [
            ...parent::menu(),
            MenuItem::make(PageResource::class, 'Pages'),
            MenuItem::make(ArticleResource::class, 'Articles'),
            MenuItem::make(ArticleCategoryResource::class, 'Article Categories'),
            MenuItem::make(GameResource::class, 'Games'),
            MenuItem::make(GameCategoryResource::class, 'Game Categories'),
            MenuItem::make(ProductResource::class, 'Products'),
            MenuItem::make(ProductAttributeResource::class, 'Product Attributes'),
            MenuItem::make(ProductVariantResource::class, 'Product Variants'),
            MenuItem::make(StoreProductResource::class, 'Store Products'),
            MenuItem::make(TrustedLogoResource::class, 'Trusted Logos'),
            MenuItem::make(StoreCategoryResource::class, 'Store Categories'),
            MenuItem::make(FormResource::class, 'Forms'),
            MenuItem::make(LeadResource::class, 'Leads'),
            MenuItem::make(SiteSettingsResource::class, 'Site settings'),
            MenuItem::make(MenuResource::class, 'Menus'),
            MenuItem::make(MenuItemResource::class, 'Menu Items'),
            MenuItem::make(ReviewResource::class, 'Reviews'),
            MenuItem::make(TeamMemberResource::class, 'Team'),
        ];
    }

    /**
     * @param ColorManager $colorManager
     */
    protected function colors(ColorManagerContract $colorManager): void
    {
        parent::colors($colorManager);

        // $colorManager->primary('#00000');
    }
}
