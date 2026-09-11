<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\Post;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\Tag;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackendFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_application_boots_and_health_endpoint_responds(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['success', 'message', 'data' => ['service', 'status', 'time']]);
    }

    public function test_unknown_api_route_returns_consistent_json_404(): void
    {
        $this->getJson('/api/v1/does-not-exist')
            ->assertNotFound()
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['success', 'message', 'errors']);
    }

    public function test_user_role_and_profile_relationship(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin-test@example.com',
            'password' => 'secret123',
        ]);

        $user->assignRole('admin');
        $this->assertTrue($user->hasRole('admin'));
        $this->assertTrue($user->hasPermissionTo('projects.create'));

        $user->profile()->create([
            'name' => 'Achmad Herdiansyah',
            'headline' => 'Junior Web Developer',
        ]);

        $this->assertNotNull($user->profile);
        $this->assertSame('Junior Web Developer', $user->profile->headline);
    }

    public function test_project_relations_technologies_and_seo(): void
    {
        $project = Project::create([
            'title' => 'Smart Inventory AI',
            'slug' => 'smart-inventory-ai',
            'status' => ContentStatus::Published,
        ]);

        $project->technologies()->create(['name' => 'Laravel']);
        $project->technologies()->create(['name' => 'MySQL', 'sort_order' => 2]);
        $project->seoMetadata()->create(['title' => 'Smart Inventory AI', 'description' => 'ERP']);

        $this->assertSame(
            ['Laravel', 'MySQL'],
            $project->technologies->sortBy('sort_order')->pluck('name')->values()->all()
        );
        $this->assertInstanceOf(SeoMetadata::class, $project->seoMetadata);
    }

    public function test_post_relations_author_category_tags_and_seo(): void
    {
        $author = User::create([
            'name' => 'Author',
            'email' => 'author@example.com',
            'password' => 'secret123',
        ]);

        $post = Post::create([
            'author_id' => $author->id,
            'title' => 'Membangun REST API dengan Laravel',
            'slug' => 'membangun-rest-api-dengan-laravel',
            'status' => ContentStatus::Draft,
        ]);

        $tag = Tag::create(['name' => 'Laravel', 'slug' => 'laravel']);
        $post->tags()->attach($tag);

        $this->assertSame($author->id, $post->author->id);
        $this->assertTrue($post->tags->contains($tag));
    }

    public function test_mass_assignment_protection_ignores_unknown_fields(): void
    {
        $project = Project::create([
            'title' => 'Tridig',
            'slug' => 'tridig',
            'is_admin' => true,
            'secret' => 'leak',
        ]);

        $this->assertFalse($project->is_admin ?? false);
        $this->assertDatabaseMissing('projects', ['secret' => 'leak']);
    }
}
