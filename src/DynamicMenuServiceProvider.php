<?php

namespace Syaim\DynamicMenu;

use Illuminate\Support\ServiceProvider;
use Syaim\DynamicMenu\Commands\InstallCommand;
use Syaim\DynamicMenu\View\Components\Breadcrumb;
use Syaim\DynamicMenu\View\Components\Dropdown;
use Syaim\DynamicMenu\View\Components\HorizontalInput;
use Syaim\DynamicMenu\View\Components\Modal;

class DynamicMenuServiceProvider extends ServiceProvider {

    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/routes/web.php');
        $this->loadViewsFrom(__DIR__.'/views', 'dynamic_menu');
        $this->loadMigrationsFrom(__DIR__.'/migrations');
        $this->loadViewComponentsAs('syaim', [
            Breadcrumb::class,
            Modal::class,
            HorizontalInput::class,
            Dropdown::class,
        ]);
        $this->publishes([
            __DIR__.'/public' => public_path('adminlte'),
            __DIR__.'/views' => resource_path('views/sch/adminlte'),
        ], 'sch-adminlte_asset');

        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallCommand::class,
            ]);
        }

    }

    public function register()
    {

    }
}
