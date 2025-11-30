<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use MoonShine\TinyMce\Providers\TinyMceServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Explicitly register TinyMCE package since auto-discovery misses it in our setup
        $this->app->register(TinyMceServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
