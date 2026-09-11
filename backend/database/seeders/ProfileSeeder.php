<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        Profile::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Achmad Herdiansyah',
                'headline' => 'Junior Web Developer',
                'bio' => 'Lulusan S1 Teknik Informatika dengan pengalaman mengembangkan aplikasi web menggunakan Laravel, PHP, dan MySQL. Memiliki pengalaman membangun sistem ERP, CMS, landing page, serta aplikasi e-booking berbasis multi-tenant. Memiliki background Multimedia dan UI/UX.',
                'location' => 'Surabaya, Indonesia',
                'email' => 'admin@example.com',
                'phone' => null,
                'is_available' => true,
                'social_links' => [
                    'github' => 'https://github.com',
                    'linkedin' => 'https://linkedin.com',
                ],
                'resume_path' => null,
            ]
        );
    }
}
