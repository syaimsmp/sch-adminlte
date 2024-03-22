<?php

namespace Syaim\DynamicMenu\seeds;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\User;

class PermissionRoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            ['name' => 'SuperAdmin', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'admin', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Access Manager', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Role Manager', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Permission Manager', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User Manager', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Menu Manager', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        ];

         Role::insert($roles);

        $permissions = [
            ['name' => 'viewAll-users', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create-users', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit-users', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete-users', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],

            ['name' => 'viewAll-roles', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create-roles', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit-roles', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete-roles', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],

            ['name' => 'viewAll-permissions', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create-permissions', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit-permissions', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete-permissions', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],

            ['name' => 'viewAll-menus', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'create-menus', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'edit-menus', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'delete-menus', 'guard_name' => 'web', 'created_at' => now(), 'updated_at' => now()],
        ];

        Permission::insert($permissions);

        $this->rolePermissionDelegation(
            ['Access Manager'],
            [
                'viewAll-roles',
                'create-roles',
                'edit-roles',
                'delete-roles',

                'viewAll-permissions',
                'create-permissions',
                'edit-permissions',
                'delete-permissions',
            ]
        );

        $this->rolePermissionDelegation(
            ['User Manager'],
            [
                'viewAll-users',
                'create-users',
                'edit-users',
                'delete-users',

                'viewAll-roles',
                'create-roles',
                'edit-roles',
                'delete-roles',

                'viewAll-permissions',
                'create-permissions',
                'edit-permissions',
                'delete-permissions',
            ]
        );

        $this->rolePermissionDelegation(
            ['Menu Manager'],
            [
                'viewAll-menus',
                'create-menus',
                'edit-menus',
                'delete-menus',

                'viewAll-permissions',
                'create-permissions',
                'edit-permissions',
                'delete-permissions',
            ]
        );

        factory(\App\User::class, 10)->create();

        $user = User::find(1);

        $user->update(
            [
                'name' => 'admin',
                'email' => 'admin@123.com',
                'password' => bcrypt('12345678'),

            ]
        );

        $user->assignRole([
            'SuperAdmin'
        ]);
        //
        // \App\User::find(3)->update(
        //     [
        //         'username' => 'access_manager',
        //         'email' => 'access_manager@123.com',
        //         'password' => '12345678',
        //     ]
        // );
        //
        // $user->assignRole([
        //     'admin',
        //     'Access Manager'
        // ]);
        //
        // $user = \App\User::find(3);
        // $user->update(
        //     [
        //         'username' => 'user_manager',
        //         'email' => 'user_manager@123.com',
        //         'password' => '12345678',
        //
        //     ]
        // );
        //
        // $user->assignRole([
        //     'admin',
        //     'User Manager'
        // ]);
        //
        // $user = \App\User::find(4);
        //
        // $user->update(
        //     [
        //         'username' => 'menu_manager',
        //         'email' => 'menu_manager@123.com',
        //         'password' => '12345678',
        //
        //     ]
        // );
        //
        // $user->assignRole([
        //     'admin',
        //     'Menu Manager'
        // ]);
    }

    private function rolePermissionDelegation(array $role_names, array $permission_names){

        foreach ($role_names as $role_name){
            $role = Role::where('name', $role_name)->first();
            if(!$role){
                echo $role_name;
            }
            $role->givePermissionTo($permission_names);
        }
    }
}
