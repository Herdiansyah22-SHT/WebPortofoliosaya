<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function seedRoles(): void
    {
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_login_success_returns_token_and_user(): void
    {
        $this->seedRoles();
        $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $admin->assignRole('admin');

        $response = $this->withHeaders(['Referer' => 'http://localhost:5173'])->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['success', 'message', 'data' => ['user' => ['id', 'name', 'email', 'roles', 'permissions']]]);

        $this->assertContains('admin', $response->json('data.user.roles'));
    }

    public function test_login_fails_with_wrong_credentials(): void
    {
        $this->seedRoles();
        User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['success', 'message', 'errors']);
    }

    public function test_login_validation_errors(): void
    {
        $this->postJson('/api/v1/auth/login', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_logout_revokes_token(): void
    {
        $this->seedRoles();
        $user = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $user->assignRole('admin');

        $login = $this->withHeaders(['Referer' => 'http://localhost:5173'])->postJson('/api/v1/auth/login', ['email' => 'admin@example.com', 'password' => 'secret123']);
        $token = $login->json('data.token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertSame(0, PersonalAccessToken::count());

        $this->app['auth']->forgetGuards();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $this->seedRoles();
        $user = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.user.email', 'admin@example.com');
    }

    public function test_guest_gets_401_on_protected_routes(): void
    {
        $this->getJson('/api/v1/admin/dashboard')->assertStatus(401);
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_guest_gets_401_ignoring_accept_header(): void
    {
        $this->get('/api/v1/admin/dashboard')->assertStatus(401);
    }

    public function test_authenticated_user_with_permission_can_access_protected_endpoint(): void
    {
        $this->seedRoles();
        $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure(['success', 'data' => ['projects', 'posts', 'media', 'unread_messages']]);
    }

    public function test_editor_with_dashboard_permission_can_access_dashboard(): void
    {
        $this->seedRoles();
        $editor = User::create(['name' => 'Editor', 'email' => 'editor@example.com', 'password' => 'secret123']);
        $editor->assignRole('editor');
        $token = $editor->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk();
    }

    public function test_user_without_permission_gets_403(): void
    {
        $this->seedRoles();
        $guest = User::create(['name' => 'Guest', 'email' => 'guest@example.com', 'password' => 'secret123']);
        $token = $guest->createToken('test')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_role_permission_matrix_admin_vs_editor(): void
    {
        $this->seedRoles();
        $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $admin->assignRole('admin');

        $editor = User::create(['name' => 'Editor', 'email' => 'editor@example.com', 'password' => 'secret123']);
        $editor->assignRole('editor');

        $this->assertTrue($admin->hasPermissionTo('settings.update'));
        $this->assertFalse($editor->hasPermissionTo('settings.update'));
        $this->assertTrue($editor->hasPermissionTo('projects.create'));
        $this->assertTrue($editor->hasPermissionTo('messages.view'));
        $this->assertFalse($editor->hasPermissionTo('messages.delete'));
        $this->assertFalse($editor->hasPermissionTo('seo.update'));
    }

    public function test_login_rate_limiting_returns_429(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'none@example.com',
                'password' => 'wrong',
            ]);
        }

        $this->postJson('/api/v1/auth/login', [
            'email' => 'none@example.com',
            'password' => 'wrong',
        ])->assertStatus(429)
            ->assertJsonPath('success', false);
    }
}
