<?php

return [

    /*
    |--------------------------------------------------------------------------
    | View Storage Paths
    |--------------------------------------------------------------------------
    |
    | This option defines the list of locations the framework will search when
    | loading view files. The default path inside `resources/views` typically
    | covers most cases, but you can add additional paths if needed.
    |
    */

    'paths' => [
        resource_path('views'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Compiled View Path
    |--------------------------------------------------------------------------
    |
    | Here you may specify where compiled Blade templates are stored. Keeping
    | this inside `storage/framework/views` matches Laravel defaults and works
    | with MoonShine out of the box. If you change it, ensure the directory
    | exists and is writable by PHP-FPM.
    |
    */

    'compiled' => env('VIEW_COMPILED_PATH', realpath(storage_path('framework/views'))),

];
