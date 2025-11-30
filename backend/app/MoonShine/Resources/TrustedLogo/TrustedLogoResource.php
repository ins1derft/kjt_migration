<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\TrustedLogo;

use Illuminate\Database\Eloquent\Model;
use App\Models\TrustedLogo;
use App\MoonShine\Resources\TrustedLogo\Pages\TrustedLogoIndexPage;
use App\MoonShine\Resources\TrustedLogo\Pages\TrustedLogoFormPage;
use App\MoonShine\Resources\TrustedLogo\Pages\TrustedLogoDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;

/**
 * @extends ModelResource<TrustedLogo, TrustedLogoIndexPage, TrustedLogoFormPage, TrustedLogoDetailPage>
 */
class TrustedLogoResource extends ModelResource
{
    protected string $model = TrustedLogo::class;

    protected string $title = 'Trusted Logos';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            TrustedLogoIndexPage::class,
            TrustedLogoFormPage::class,
            TrustedLogoDetailPage::class,
        ];
    }
}
