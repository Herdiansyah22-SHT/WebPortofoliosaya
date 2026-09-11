<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_public_endpoint(): void
    {
        Profile::create([
            'name' => 'Achmad Herdiansyah',
            'headline' => 'Junior Web Developer',
            'social_links' => ['github' => 'https://github.com'],
        ]);

        $this->getJson('/api/v1/profile')
            ->assertOk()
            ->assertJsonPath('data.name', 'Achmad Herdiansyah')
            ->assertJsonPath('data.social_links.github', 'https://github.com');
    }

    public function test_skills_returns_active_only(): void
    {
        Skill::create(['name' => 'Laravel', 'is_active' => true, 'sort_order' => 1]);
        Skill::create(['name' => 'Hidden', 'is_active' => false, 'sort_order' => 2]);

        $this->getJson('/api/v1/skills')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Laravel');
    }

    public function test_projects_public_returns_published_only(): void
    {
        Project::create(['title' => 'Published', 'slug' => 'published', 'status' => ContentStatus::Published, 'published_at' => now()]);
        Project::create(['title' => 'Draft', 'slug' => 'draft', 'status' => ContentStatus::Draft]);
        Project::create(['title' => 'Archived', 'slug' => 'archived', 'status' => ContentStatus::Archived]);

        $this->getJson('/api/v1/projects')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'published')
            ->assertJsonStructure(['success', 'message', 'data', 'meta' => ['current_page', 'per_page', 'total', 'last_page']]);
    }

    public function test_project_detail_by_slug_and_draft_404(): void
    {
        Project::create(['title' => 'Published', 'slug' => 'smart-inventory-ai', 'status' => ContentStatus::Published, 'published_at' => now()]);
        Project::create(['title' => 'Draft', 'slug' => 'draft-project', 'status' => ContentStatus::Draft]);

        $this->getJson('/api/v1/projects/smart-inventory-ai')->assertOk()->assertJsonPath('data.slug', 'smart-inventory-ai');
        $this->getJson('/api/v1/projects/draft-project')->assertNotFound();
    }

    public function test_projects_supports_featured_search_and_pagination(): void
    {
        Project::create(['title' => 'Featured Laravel App', 'slug' => 'f1', 'status' => ContentStatus::Published, 'is_featured' => true, 'published_at' => now()]);
        Project::create(['title' => 'Tridig CMS', 'slug' => 'f2', 'status' => ContentStatus::Published, 'published_at' => now()]);

        $this->getJson('/api/v1/projects?featured=1')->assertJsonCount(1, 'data')->assertJsonPath('data.0.slug', 'f1');
        $this->getJson('/api/v1/projects?search=laravel')->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/projects?per_page=1')->assertJsonPath('meta.total', 2)->assertJsonCount(1, 'data');
    }

    public function test_posts_public_returns_published_only_with_category_filter(): void
    {
        $category = Category::create(['name' => 'Tutorial', 'slug' => 'tutorial']);
        Post::create(['title' => 'Belajar Laravel', 'slug' => 'belajar-laravel', 'status' => ContentStatus::Published, 'category_id' => $category->id, 'published_at' => now()]);
        Post::create(['title' => 'Draft Post', 'slug' => 'draft-post', 'status' => ContentStatus::Draft]);

        $this->getJson('/api/v1/posts')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/posts?category=tutorial')
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/posts/belajar-laravel')->assertOk();
        $this->getJson('/api/v1/posts/draft-post')->assertNotFound();
    }

    public function test_experiences_educations_certificates_return_active_only(): void
    {
        Experience::create(['company' => 'PT A', 'position' => 'Dev', 'start_date' => '2023-01-01', 'is_active' => true]);
        Experience::create(['company' => 'PT B', 'position' => 'Dev', 'start_date' => '2023-01-01', 'is_active' => false]);

        Education::create(['institution' => 'UNTAG', 'start_year' => 2022, 'is_active' => true]);
        Education::create(['institution' => 'Other', 'start_year' => 2020, 'is_active' => false]);

        Certificate::create(['title' => 'Laravel', 'issuer' => 'X', 'issued_date' => '2023-01-01', 'is_active' => true]);
        Certificate::create(['title' => 'Hidden', 'issuer' => 'Y', 'issued_date' => '2023-01-01', 'is_active' => false]);

        $this->getJson('/api/v1/experiences')->assertJsonCount(1, 'data')->assertJsonPath('data.0.company', 'PT A');
        $this->getJson('/api/v1/educations')->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/certificates')->assertJsonCount(1, 'data');
    }

    public function test_categories_public_returns_active(): void
    {
        Category::create(['name' => 'Tutorial', 'slug' => 'tutorial', 'is_active' => true]);
        Category::create(['name' => 'Hidden', 'slug' => 'hidden', 'is_active' => false]);

        $this->getJson('/api/v1/categories')->assertJsonCount(1, 'data');
    }

    public function test_contact_submission_validates_and_stores(): void
    {
        $this->postJson('/api/v1/contact', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);

        $this->postJson('/api/v1/contact', [
            'name' => 'Visitor',
            'email' => 'visitor@example.com',
            'subject' => 'Kerja sama',
            'message' => 'Halo, saya tertarik bekerja sama.',
        ])->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('contact_messages', ['email' => 'visitor@example.com', 'is_read' => false]);
    }

    public function test_contact_rate_limiting_returns_429(): void
    {
        $payload = ['name' => 'A', 'email' => 'a@example.com', 'subject' => 'S', 'message' => 'M'];

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/contact', $payload);
        }

        $this->postJson('/api/v1/contact', $payload)->assertStatus(429);
    }
}
