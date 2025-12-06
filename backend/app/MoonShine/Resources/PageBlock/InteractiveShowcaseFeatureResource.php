<?php

declare(strict_types=1);

namespace App\MoonShine\Resources\PageBlock;

use App\Models\PageBlocks\InteractiveShowcaseFeature;
use MoonShine\Laravel\Resources\ModelResource;
use MoonShine\Contracts\Core\PageContract;
use MoonShine\Laravel\Pages\Crud\IndexPage;
use MoonShine\Laravel\Pages\Crud\FormPage;
use MoonShine\Laravel\Pages\Crud\DetailPage;
use MoonShine\UI\Fields\ID;
use MoonShine\UI\Fields\Text;
use MoonShine\UI\Fields\Image;
use MoonShine\UI\Fields\Number;
use MoonShine\UI\Components\Layout\Box;

/**
 * @extends ModelResource<InteractiveShowcaseFeature, InteractiveShowcaseFeatureIndexPage, InteractiveShowcaseFeatureFormPage, InteractiveShowcaseFeatureDetailPage>
 */
class InteractiveShowcaseFeatureResource extends ModelResource
{
    protected string $model = InteractiveShowcaseFeature::class;

    protected string $title = 'Showcase features';

    /**
     * @return list<class-string<PageContract>>
     */
    protected function pages(): array
    {
        return [
            InteractiveShowcaseFeatureIndexPage::class,
            InteractiveShowcaseFeatureFormPage::class,
            InteractiveShowcaseFeatureDetailPage::class,
        ];
    }
}

class InteractiveShowcaseFeatureIndexPage extends IndexPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}

class InteractiveShowcaseFeatureFormPage extends FormPage
{
    protected function fields(): iterable
    {
        return [
            Box::make('Feature', [
                ID::make(),
                Image::make('Icon', 'icon')
                    ->disk('public')
                    ->dir('pages/interactive_showcase/icons')
                    ->removable(),
                Text::make('Label', 'label')->required()->unescape(),
                Number::make('Position', 'position')->default(0),
            ]),
        ];
    }
}

class InteractiveShowcaseFeatureDetailPage extends DetailPage
{
    protected function fields(): iterable
    {
        return [
            ID::make(),
            Image::make('Icon', 'icon'),
            Text::make('Label', 'label'),
            Number::make('Position', 'position'),
        ];
    }
}
