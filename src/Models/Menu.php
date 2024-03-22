<?php

namespace Syaim\DynamicMenu\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasRoles, SoftDeletes;
    protected $guarded = ['id'];

    protected $guard_name = 'web';

    public function children(){
        return $this->hasMany(Menu::class, 'menu_id');
    }

    public function parent(){
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function getPermissionNamesAttribute(){
        return $this->getPermissionNames();
    }

    public static function filterAndTransform($side_menu){
        $user = Auth::user();

        if(
            $user
            &&
            (
                $user->hasAnyPermission($side_menu->getAllPermissions())
                ||
                $user->hasAnyRole(['SuperAdmin'])
            )
        )
        {
            if($side_menu->params){
            }
                return [
                'id' => $side_menu->id ,
                'name' => $side_menu->name ,
                'route' => Route::has($side_menu->route) ? route($side_menu->route, json_decode($side_menu->params, true)) : '#route_not_found',
                'menu_id' => $side_menu->menu_id ,
                'icon' => $side_menu->icon ,
                'is_active' => $side_menu->is_active ,
                'is_title' => $side_menu->is_title ,
                'remark' => $side_menu->remark ,
                'children' => $side_menu->children
                    ->transform(function($sub_menu){ return self::filterAndTransform($sub_menu);})
                    ->reject(function ($value, $key) { return !$value; })
                    ->sortBy('name')
            ];
        }

    }

}
