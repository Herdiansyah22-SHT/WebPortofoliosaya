<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'site.name' => ['value' => 'Achmad Herdiansyah'],
            'site.tagline' => ['value' => 'Junior Web Developer'],
            'site.description' => ['value' => 'Portfolio pribadi Achmad Herdiansyah — Junior Web Developer.'],
            'site.social_links' => [
                'value' => [
                    'github' => 'https://github.com',
                    'linkedin' => 'https://linkedin.com',
                ],
            ],
            'seo.default_title' => ['value' => 'Achmad Herdiansyah — Junior Web Developer'],
            'seo.default_description' => ['value' => 'Portfolio pribadi Achmad Herdiansyah. Laravel, PHP, MySQL, React.'],
            'seo.default_og_type' => ['value' => 'website'],
            'seo.default_og_image' => ['value' => ''],
            'seo.robots_txt' => ['value' => "User-agent: *\nAllow: /\nDisallow: /admin\n"],
        ];

        foreach ($settings as $key => $data) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $data['value']]
            );
        }
    }
}
