<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',
            'profile.update',
            'projects.view', 'projects.create', 'projects.update', 'projects.delete',
            'skills.view', 'skills.create', 'skills.update', 'skills.delete',
            'experience.view', 'experience.create', 'experience.update', 'experience.delete',
            'education.view', 'education.create', 'education.update', 'education.delete',
            'certificates.view', 'certificates.create', 'certificates.update', 'certificates.delete',
            'posts.view', 'posts.create', 'posts.update', 'posts.delete',
            'media.view', 'media.upload', 'media.delete',
            'messages.view', 'messages.update', 'messages.delete',
            'seo.view', 'seo.update',
            'settings.view', 'settings.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
        $editor->syncPermissions([
            'dashboard.view',
            'projects.view', 'projects.create', 'projects.update', 'projects.delete',
            'skills.view', 'skills.create', 'skills.update', 'skills.delete',
            'experience.view', 'experience.create', 'experience.update', 'experience.delete',
            'education.view', 'education.create', 'education.update', 'education.delete',
            'certificates.view', 'certificates.create', 'certificates.update', 'certificates.delete',
            'posts.view', 'posts.create', 'posts.update', 'posts.delete',
            'media.view', 'media.upload', 'media.delete',
            'messages.view', 'messages.update',
            'seo.view',
        ]);
    }
}
