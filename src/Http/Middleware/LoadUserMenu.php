<?php

namespace Syaim\DynamicMenu\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Syaim\DynamicMenu\Models\Menu;

class LoadUserMenu
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
            View::composer('*', function ($view) {

                if(Auth::check()) {

                    $menus = session()->get('sidebar_menus', function () {

                        $sidebar_data = Menu::with(['permissions', 'children'])
                            ->where('menu_id', 0)
                            ->orderBy('name')
                            ->get();

                        $sidebar_data = $sidebar_data->transform(function($m){
                            return Menu::filterAndTransform($m);
                        })
                        ->reject(function ($value, $key) { return !$value; });

                        session()->put('sidebar_menus', $sidebar_data);

                        return $sidebar_data;
                    });

                    // dd($menus);

                    $view->with('sidebar_menus', $menus);
                }
            });

        return $next($request);
    }
}
