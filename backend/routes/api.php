<?php

use App\Models\Post;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['ok' => true]);

Route::get('/posts', function () {
    return Post::query()
        ->orderByDesc('published_at')
        ->orderByDesc('created_at')
        ->get();
});

Route::get('/posts/{slug}', function (string $slug) {
    return Post::query()->where('slug', $slug)->firstOrFail();
});
