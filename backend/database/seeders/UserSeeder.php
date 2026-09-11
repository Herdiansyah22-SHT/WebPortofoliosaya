<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Achmad Herdiansyah',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');

        $editor = User::firstOrCreate(
            ['email' => 'editor@example.com'],
            [
                'name' => 'Content Editor',
                'password' => Hash::make('password'),
            ]
        );
        $editor->assignRole('editor');
    }
}
