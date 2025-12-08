<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\Page\Pages;

use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Contracts\UI\ComponentContract;
use MoonShine\UI\Components\Table\TableBuilder;
use MoonShine\Contracts\UI\FieldContract;
use MoonShine\Laravel\QueryTags\QueryTag;
use MoonShine\UI\Components\Metrics\Wrapped\Metric;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Date;
use MoonShine\UI\Fields\Select;
use MoonShine\UI\Fields\Hidden;
use MoonShine\UI\Components\ActionButton;
use App\MoonShine\Resources\Page\PageResource;
use MoonShine\Support\Attributes\AsyncMethod;
use MoonShine\Contracts\Core\DependencyInjection\CrudRequestContract;
use MoonShine\Crud\JsonResponse;
use MoonShine\Support\Enums\HttpMethod;
use MoonShine\Support\Enums\ToastType;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\Page;
use MoonShine\Support\ListOf;
use Throwable;


/**
 * @extends IndexPage<PageResource>
 */
class PageIndexPage extends IndexPage
{
    protected bool $isLazy = true;

    /**
     * @return list<FieldContract>
     */
    protected function fields(): iterable
    {
        return [
            ID::make()->sortable(),
            Text::make('Title', 'title'),
            Text::make('Slug', 'slug'),
            Text::make('Type', 'type'),
            Text::make('Status', 'status'),
            Date::make('Published at', 'published_at')->format('Y-m-d H:i'),
        ];
    }

    protected function buttons(): ListOf
    {
        $buttons = parent::buttons();

        return $buttons->add(
            ActionButton::make('Clone')
                ->icon('document-duplicate')
                ->method(
                    'clonePage',
                    params: fn(\App\Models\Page $page) => ['resourceItem' => $page->getKey()],
                    page: $this,
                    resource: $this->getResource(),
                )
                ->withConfirm(
                    title: fn(\App\Models\Page $page) => "Clone \"{$page->title}\"",
                    button: 'Create copy',
                    method: \MoonShine\Support\Enums\HttpMethod::POST,
                    fields: fn(\App\Models\Page $page) => [
                        Text::make('Title', 'title')
                            ->setValue($this->defaultCloneTitle($page->title))
                            ->required(),
                        Text::make('Slug', 'slug')
                            ->setValue($this->defaultCloneSlug($page->slug))
                            ->required(),
                    ],
                    name: fn(\App\Models\Page $page) => 'clone-page-' . $page->getKey(),
                )
                ->showInDropdown()
        );
    }

    #[AsyncMethod]
    public function clonePage(CrudRequestContract $request, JsonResponse $response): JsonResponse
    {
        $page = $request->getResource()?->getItem();

        if (! $page instanceof \App\Models\Page) {
            return $response->toast('Page not found for cloning.', \MoonShine\Support\Enums\ToastType::ERROR);
        }

        $title = trim((string) $request->get('title', ''));
        $slug  = trim((string) $request->get('slug', ''));

        if ($title === '' || $slug === '') {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'title' => 'Title is required',
                'slug'  => 'Slug is required',
            ]);
        }

        $title = filled($title) ? $title : $this->defaultCloneTitle($page->title);
        $slugCandidate = filled($slug) ? $slug : $this->defaultCloneSlug($page->slug);

        $slug = $this->uniqueSlug($slugCandidate);

        $duplicate = $page->replicate();
        $duplicate->title = $title;
        $duplicate->slug = $slug;
        $duplicate->status = 'draft';
        $duplicate->published_at = null;

        $duplicate->save();

        $resource = $request->getResource();

        $editUrl = $resource?->getFormPageUrl($duplicate->getKey())
            ?? url(sprintf('/admin/resource/page-resource/page-form-page?resourceItem=%s', $duplicate->getKey()));

        return JsonResponse::make()
            ->toast('Page cloned as draft', ToastType::SUCCESS)
            ->redirect($editUrl);
    }

    private function defaultCloneTitle(string $title): string
    {
        return "{$title} (copy)";
    }

    private function defaultCloneSlug(string $slug): string
    {
        return $this->uniqueSlug(Str::slug($slug) . '-copy');
    }

    private function uniqueSlug(string $base): string
    {
        $slug = Str::slug($base) ?: 'page';
        $original = $slug;
        $counter = 2;

        while (Page::query()->where('slug', $slug)->exists()) {
            $slug = "{$original}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * @return list<FieldContract>
     */
    protected function filters(): iterable
    {
        return [
            Select::make('Type', 'type')
                ->options([
                    'product_landing' => 'Product landing',
                    'static' => 'Static',
                ])
                ->nullable()
                ->searchable(),
        ];
    }

    /**
     * @return list<QueryTag>
     */
    protected function queryTags(): array
    {
        return [];
    }

    /**
     * @return list<Metric>
     */
    protected function metrics(): array
    {
        return [];
    }

    /**
     * @param  TableBuilder  $component
     *
     * @return TableBuilder
     */
    protected function modifyListComponent(ComponentContract $component): ComponentContract
    {
        return $component;
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function topLayer(): array
    {
        return [
            ...parent::topLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function mainLayer(): array
    {
        return [
            ...parent::mainLayer()
        ];
    }

    /**
     * @return list<ComponentContract>
     * @throws Throwable
     */
    protected function bottomLayer(): array
    {
        return [
            ...parent::bottomLayer()
        ];
    }
}
