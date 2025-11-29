<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoreProductController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['ok' => true]);

Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);

Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/store/products', [StoreProductController::class, 'index']);
Route::get('/store/products/{slug}', [StoreProductController::class, 'show']);

Route::get('/forms/{code}', [FormController::class, 'show']);
Route::post('/forms/{code}', [FormController::class, 'submit']);
