<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Lead;

use Illuminate\Database\Eloquent\Model;
use App\Models\Lead;
use App\MoonShine\Resources\Lead\Pages\LeadIndexPage;
use App\MoonShine\Resources\Lead\Pages\LeadFormPage;
use App\MoonShine\Resources\Lead\Pages\LeadDetailPage;

use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Support\Enums\Ability;
use MoonShine\Support\Enums\Action;
use MoonShine\Support\ListOf;

/**
 * @extends ModelResource<Lead, LeadIndexPage, LeadFormPage, LeadDetailPage>
 */
class LeadResource extends ModelResource
{
    protected string $model = Lead::class;

    protected string $title = 'Leads';
    
    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            LeadIndexPage::class,
            LeadDetailPage::class,
        ];
    }

    /**
     * Leads are read-only: disable create/update/delete actions.
     *
     * @return ListOf<Action>
     */
    protected function activeActions(): ListOf
    {
        return new ListOf(Action::class, [
            Action::VIEW,
        ]);
    }

    /**
     * Leads are view-only in admin for now.
     *
     * @return list<Ability>
     */
    public function getGateAbilities(): array
    {
        return [
            Ability::VIEW_ANY,
            Ability::VIEW,
        ];
    }
}
