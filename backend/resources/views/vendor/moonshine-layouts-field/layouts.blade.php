@php
    $resourceUri = moonshineRequest()->getResourceUri();
    $pageUri = moonshineRequest()->getPageUri();
@endphp

<div
    x-data="layouts(
        `{{ $addRoute }}`,
        `{{ $column }}`
    )"
    {{ $attributes->class('space-y-2') }}
    data-top-level="true"
    data-layouts-add-route="{{ $addRoute }}"
    data-layouts-paste-route="{{ route('moonshine.layouts-field.paste', ['resourceUri' => $resourceUri, 'pageUri' => $pageUri]) }}"
    data-layouts-column="{{ $column }}"
>
    <div class="_layouts-blocks space-y-2">
        @foreach($fields as $layout)
            {!! $layout !!}
        @endforeach
    </div>

    <div class="flex items-center gap-2">
        {!! $dropdown !!}
        <x-moonshine::form.button
            type="button"
            class="btn-secondary _layouts-paste-btn"
            title="Paste previously copied block"
        >
            Paste block
        </x-moonshine::form.button>
    </div>
</div>

