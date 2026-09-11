<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\Post;
use App\Models\Project;
use Database\Seeders\SiteSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_settings_public_endpoint(): void
    {
        $this->seed(SiteSettingSeeder::class);

        $this->getJson('/api/v1/site')
            ->assertOk()
            ->assertJsonPath('data.site.name', 'Achmad Herdiansyah')
            ->assertJsonPath('data.seo.default_og_type', 'website');
    }

    public function test_sitemap_only_contains_public_content(): void
    {
        Project::create(['title' => 'Visible', 'slug' => 'visible-project', 'status' => ContentStatus::Published, 'published_at' => now()]);
        Project::create(['title' => 'Hidden', 'slug' => 'draft-project', 'status' => ContentStatus::Draft]);
        Post::create(['title' => 'Post A', 'slug' => 'post-a', 'status' => ContentStatus::Published, 'published_at' => now()]);
        Post::create(['title' => 'Post B', 'slug' => 'post-b', 'status' => ContentStatus::Draft]);

        $response = $this->get('/sitemap.xml');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');

        $body = $response->getContent();
        $this->assertStringContainsString('/projects/visible-project', $body);
        $this->assertStringContainsString('/blog/post-a', $body);
        $this->assertStringContainsString('/about', $body);
        $this->assertStringNotContainsString('draft-project', $body);
        $this->assertStringNotContainsString('post-b', $body);
        $this->assertStringNotContainsString('/admin', $body);
    }

    public function test_robots_txt_references_sitemap_and_blocks_admin(): void
    {
        $this->seed(SiteSettingSeeder::class);

        $response = $this->get('/robots.txt');
        $response->assertOk();
        $this->assertStringStartsWith('text/plain', $response->headers->get('Content-Type'));

        $body = $response->getContent();
        $this->assertStringContainsString('Disallow: /admin', $body);
        $this->assertStringContainsString('Sitemap: http://localhost/sitemap.xml', $body);
    }
}
