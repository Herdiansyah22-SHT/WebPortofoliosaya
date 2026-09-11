<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SiteSettingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    private string $editorToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(SiteSettingSeeder::class);

        $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $admin->assignRole('admin');
        $this->token = $admin->createToken('test')->plainTextToken;

        $editor = User::create(['name' => 'Editor', 'email' => 'editor@example.com', 'password' => 'secret123']);
        $editor->assignRole('editor');
        $this->editorToken = $editor->createToken('test')->plainTextToken;
    }

    private function authHeaders(string $token): array
    {
        return ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'];
    }

    public function test_project_crud_full_cycle(): void
    {
        $payload = [
            'title' => 'Smart Inventory AI',
            'summary' => 'ERP inventory',
            'status' => 'published',
            'technologies' => ['Laravel', 'MySQL'],
        ];

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/projects', $payload)
            ->assertCreated()
            ->assertJsonPath('data.slug', 'smart-inventory-ai');

        $id = Project::first()->id;

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson("/api/v1/admin/projects/{$id}")
            ->assertOk()
            ->assertJsonPath('data.title', 'Smart Inventory AI');

        $this->withHeaders($this->authHeaders($this->token))
            ->patchJson("/api/v1/admin/projects/{$id}", ['title' => 'Smart Inventory AI 2', 'status' => 'published'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Smart Inventory AI 2');

        $this->withHeaders($this->authHeaders($this->token))
            ->deleteJson("/api/v1/admin/projects/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('projects', ['id' => $id]);
    }

    public function test_project_duplicate_slug_is_rejected(): void
    {
        Project::create(['title' => 'Existing', 'slug' => 'dup', 'status' => 'draft']);

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/projects', ['title' => 'New', 'slug' => 'dup', 'status' => 'draft'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_project_validation_required_fields(): void
    {
        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/projects', ['status' => 'draft'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }

    public function test_projects_admin_list_search_and_pagination(): void
    {
        Project::create(['title' => 'Tridig CMS', 'slug' => 'tridig', 'status' => 'published']);
        Project::create(['title' => 'PSHT Landing', 'slug' => 'psht', 'status' => 'draft']);

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson('/api/v1/admin/projects?search=tridig')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson('/api/v1/admin/projects?per_page=1')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonCount(1, 'data');
    }

    public function test_post_crud_full_cycle_with_category_and_tags(): void
    {
        $category = Category::create(['name' => 'Tutorial', 'slug' => 'tutorial']);

        $payload = [
            'title' => 'Membangun REST API dengan Laravel',
            'body' => str_repeat('Kata ', 400),
            'category_id' => $category->id,
            'tags' => ['Laravel', 'API'],
            'status' => 'published',
        ];

        $response = $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/posts', $payload)
            ->assertCreated();

        $this->assertSame('membangun-rest-api-dengan-laravel', $response->json('data.slug'));
        $this->assertNotNull($response->json('data.published_at'));
        $this->assertGreaterThan(0, $response->json('data.reading_time'));

        $id = Post::first()->id;
        $this->assertDatabaseHas('post_tags', ['post_id' => $id]);

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson("/api/v1/admin/posts/{$id}")
            ->assertOk()
            ->assertJsonPath('data.category.name', 'Tutorial')
            ->assertJsonCount(2, 'data.tags');

        $this->withHeaders($this->authHeaders($this->token))
            ->patchJson("/api/v1/admin/posts/{$id}", ['title' => 'Updated', 'status' => 'draft'])
            ->assertOk();

        $this->withHeaders($this->authHeaders($this->token))
            ->deleteJson("/api/v1/admin/posts/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('posts', ['id' => $id]);
    }

    public function test_post_publish_requires_body(): void
    {
        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/posts', ['title' => 'Tanpa Konten', 'status' => 'published'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('body');

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/posts', ['title' => 'Draft Kosong', 'status' => 'draft'])
            ->assertCreated();
    }

    public function test_simple_resources_crud(): void
    {
        $skill = $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/skills', ['name' => 'PHP'])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->token))
            ->patchJson('/api/v1/admin/skills/'.$skill->json('data.id'), ['name' => 'PHP 8'])
            ->assertOk();

        $this->withHeaders($this->authHeaders($this->token))
            ->deleteJson('/api/v1/admin/skills/'.$skill->json('data.id'))
            ->assertOk();

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/experiences', ['company' => 'PT ABC', 'position' => 'Developer', 'start_date' => '2023-01-01'])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/educations', ['institution' => 'UNTAG', 'start_year' => 2022])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/certificates', ['title' => 'Laravel', 'issuer' => 'X'])
            ->assertCreated();

        $cat = $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/categories', ['name' => 'Tutorial'])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->token))
            ->postJson('/api/v1/admin/tags', ['name' => 'Laravel'])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->token))
            ->deleteJson('/api/v1/admin/categories/'.$cat->json('data.id'))
            ->assertOk();
    }

    public function test_profile_admin_update(): void
    {
        Profile::create(['name' => 'Old', 'headline' => 'Old Title']);

        $this->withHeaders($this->authHeaders($this->token))
            ->putJson('/api/v1/admin/profile', [
                'name' => 'Achmad Herdiansyah',
                'headline' => 'Junior Web Developer',
                'social_links' => ['github' => 'https://github.com'],
            ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Achmad Herdiansyah');
    }

    public function test_messages_flow(): void
    {
        $message = ContactMessage::create([
            'name' => 'Visitor',
            'email' => 'v@example.com',
            'subject' => 'Hi',
            'message' => 'Hello',
        ]);

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson('/api/v1/admin/messages')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->withHeaders($this->authHeaders($this->token))
            ->putJson("/api/v1/admin/messages/{$message->id}", ['is_read' => true])
            ->assertOk()
            ->assertJsonPath('data.is_read', true)
            ->assertJsonPath('data.read_at', fn ($v) => $v !== null);

        $this->withHeaders($this->authHeaders($this->token))
            ->deleteJson("/api/v1/admin/messages/{$message->id}")
            ->assertOk();
    }

    public function test_seo_and_settings_management(): void
    {
        $this->withHeaders($this->authHeaders($this->token))
            ->getJson('/api/v1/admin/seo')
            ->assertOk();

        $this->withHeaders($this->authHeaders($this->token))
            ->putJson('/api/v1/admin/seo', ['seo' => ['default_title' => 'My Portfolio']])
            ->assertOk()
            ->assertJsonPath('data.seo.default_title', 'My Portfolio');

        $this->withHeaders($this->authHeaders($this->token))
            ->putJson('/api/v1/admin/settings', [
                'site' => [
                    'name' => 'Portofolio Baru',
                    'tagline' => 'Junior Web Developer',
                ],
            ])
            ->assertOk()
            ->assertJsonPath('data.site.name', 'Portofolio Baru');
    }

    public function test_editor_can_create_project_but_not_settings(): void
    {
        $this->withHeaders($this->authHeaders($this->editorToken))
            ->postJson('/api/v1/admin/projects', ['title' => 'Editor Project', 'status' => 'draft'])
            ->assertCreated();

        $this->withHeaders($this->authHeaders($this->editorToken))
            ->putJson('/api/v1/admin/settings', ['site.name' => 'X', 'site.tagline' => 'Y'])
            ->assertStatus(403);

        $this->withHeaders($this->authHeaders($this->editorToken))
            ->getJson('/api/v1/admin/settings')
            ->assertStatus(403);
    }

    public function test_guest_gets_401_and_missing_resource_404(): void
    {
        $this->getJson('/api/v1/admin/projects')->assertStatus(401);

        $this->withHeaders($this->authHeaders($this->token))
            ->getJson('/api/v1/admin/projects/999999')
            ->assertNotFound();
    }

    public function test_editor_cannot_delete_message(): void
    {
        $message = ContactMessage::create([
            'name' => 'Visitor',
            'email' => 'v@example.com',
            'subject' => 'Hi',
            'message' => 'Hello',
        ]);

        $this->withHeaders($this->authHeaders($this->editorToken))
            ->deleteJson("/api/v1/admin/messages/{$message->id}")
            ->assertStatus(403);
    }
}
