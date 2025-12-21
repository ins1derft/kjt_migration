<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArticleCategoryController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\GameCategoryController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SensoryRoomBundleController;
use App\Http\Controllers\Api\StoreProductController;
use App\Http\Controllers\Api\TrustedLogoController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SiteSettingsController;
use App\Http\Controllers\Api\TeamMemberController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['ok' => true]);

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/site-settings', [SiteSettingsController::class, 'show']);

Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/article-categories', [ArticleCategoryController::class, 'index']);

Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);
Route::get('/game-categories', [GameCategoryController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/sensory-room-bundles', [SensoryRoomBundleController::class, 'index']);
Route::get('/sensory-room-bundles/{slug}', [SensoryRoomBundleController::class, 'show']);

Route::get('/store/products', [StoreProductController::class, 'index']);
Route::get('/store/products/{slug}', [StoreProductController::class, 'show']);

Route::get('/trusted-logos', [TrustedLogoController::class, 'index']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::get('/team-members/{slug}', [TeamMemberController::class, 'show']);

Route::get('/forms/{code}', [FormController::class, 'show']);
Route::post('/forms/{code}', [FormController::class, 'submit']);
