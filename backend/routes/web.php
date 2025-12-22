<?php

use App\Http\Controllers\MoonShine\LayoutsPasteController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// MoonShine extra endpoint: paste layout blocks from clipboard
Route::moonshine(static function (): void {
    Route::post('/layouts-paste/{resourceUri?}', [LayoutsPasteController::class, 'store'])
        ->name('layouts-field.paste');
}, withPage: true, withAuthenticate: true);
