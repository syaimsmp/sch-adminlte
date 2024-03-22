<?php

namespace Syaim\DynamicMenu\seeds;

use Illuminate\Database\Seeder;
use Syaim\DynamicMenu\Models\Menu;

class MenuSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $menus = [
            [
                'name' => 'Admin Configuration',
                'route' => '#',
                'params' => null,
                'icon' => 'fas fa-assistive-listening-systems',
                'is_active' => true,
                'is_title' => true,
                'permissions' => ['viewAll-users', 'viewAll-roles', 'viewAll-permissions', 'viewAll-menus'],

                'children' => [
                    [
                        'name' => 'Permission Management',
                        'route' => 'admin.permission.index',
                        'params' => null,
                        'icon' => 'fas fa-address-book',
                        'is_active' => true,
                        'is_title' => false,
                        'remark' => 'Manage Permissions',
                        'permissions' => ['viewAll-permissions'],
                    ],
                    [
                        'name' => 'Role Management',
                        'route' => 'admin.role.index',
                        'params' => null,
                        'icon' => 'fas fa-umbrella',
                        'is_active' => true,
                        'is_title' => false,
                        'remark' => 'Manage Roles',
                        'permissions' => ['viewAll-roles'],
                    ],
                    [
                        'name' => 'User Management',
                        'route' => 'admin.user.index',
                        'params' => null,
                        'icon' => 'fas fa-anchor',
                        'is_active' => true,
                        'is_title' => false,
                        'remark' => 'Manage Users',
                        'permissions' => ['viewAll-users'],
                    ],
                    [
                        'name' => 'Menu Management',
                        'route' => 'admin.menu.index',
                        'params' => null,
                        'icon' => 'fas fa-align-center',
                        'is_active' => true,
                        'is_title' => false,
                        'remark' => 'Manage Menus',
                        'permissions' => ['viewAll-menus'],
                    ],
                ]
            ],
            // [
            //     'name' => 'Barcode Masterlist',
            //     'route' => 'qrcode.index',
            //     'params' => null,
            //     'icon' => 'fas fa-qrcode nav-icon',
            //     'is_active' => true,
            //     'is_title' => false,
            //     'permissions' => ['Masterlist'],
            //     'children' => [],
            // ]

        ];

        foreach($menus as $menu){

            $new_menu = $this->createMenu($menu, 0);
            if(isset($menu['permissions'])){
                $new_menu->givePermissionTo($menu['permissions']);
            }

            if(count($menu['children'])){
                foreach ($menu['children'] as $child){
                    $new_child = $this->createMenu($child, $new_menu->id);
                    if(isset($child['permissions'])){
                        $new_child->givePermissionTo($child['permissions']);
                    }

                }
            }

        }

    }

    private function createMenu($data, $parent_id){

        return Menu::updateOrCreate([
            'name' => $data['name']
        ],[
            'route' => $data['route'],
            'params' => $data['params'],
            'icon' => $data['icon'],
            'menu_id' => $parent_id,
            'is_active' => $data['is_active'],
            'is_title' => $data['is_title'],
            'remark' => $data['remark'] ?? null,
        ]);
    }
}
