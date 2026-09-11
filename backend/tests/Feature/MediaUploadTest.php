<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->seed(RolePermissionSeeder::class);

        $admin = User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => 'secret123']);
        $admin->assignRole('admin');
        $this->token = $admin->createToken('test')->plainTextToken;
    }

    public function test_media_upload_valid_image(): void
    {
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', [
                'file' => UploadedFile::fake()->image('foto.png', 100, 50),
                'collection' => 'gallery',
                'alt_text' => 'Foto project',
            ])
            ->assertCreated()
            ->assertJsonPath('data.collection', 'gallery')
            ->assertJsonPath('data.alt_text', 'Foto project')
            ->assertJsonPath('data.width', 100)
            ->assertJsonPath('data.height', 50);

        Storage::disk('public')->assertExists(str($this->app->make(Media::class)->first()->path));
    }

    public function test_media_upload_rejects_invalid_mime(): void
    {
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', [
                'file' => UploadedFile::fake()->create('not-image.txt', 100),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');

        Storage::disk('public')->assertDirectoryEmpty('uploads');
    }

    public function test_media_upload_rejects_oversized_file(): void
    {
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', [
                'file' => UploadedFile::fake()->create('big.png', 3000, 'image/png'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('file');
    }

    public function test_media_upload_requires_auth(): void
    {
        $this->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('x.png'),
        ])->assertStatus(401);
    }

    public function test_media_delete_removes_file(): void
    {
        $file = UploadedFile::fake()->image('deleteme.png');
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', ['file' => $file])
            ->assertCreated();

        $id = $response->json('data.id');
        $path = Media::find($id)->path;

        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson("/api/v1/admin/media/{$id}")
            ->assertOk();

        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseMissing('media', ['id' => $id]);
    }

    public function test_media_index_paginated(): void
    {
        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', ['file' => UploadedFile::fake()->image('a.png')]);

        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/v1/admin/media')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure(['success', 'data', 'meta' => ['current_page', 'per_page', 'total', 'last_page']]);
    }

    public function test_profile_photo_attach_and_detach(): void
    {
        \App\Models\Profile::create(['name' => 'Achmad', 'headline' => 'Developer']);

        $upload = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', ['file' => UploadedFile::fake()->image('profil.png')])
            ->assertCreated();

        $id = $upload->json('data.id');

        $auth = ['Authorization' => "Bearer {$this->token}"];

        $this->withHeaders($auth)->putJson('/api/v1/admin/profile', [
            'name' => 'Achmad',
            'headline' => 'Developer',
            'photo_media_id' => $id,
        ])->assertOk();

        $this->assertNotNull($this->getJson('/api/v1/profile')->json('data.photo_url'));

        $this->withHeaders($auth)->putJson('/api/v1/admin/profile', [
            'name' => 'Achmad',
            'headline' => 'Developer',
            'photo_media_id' => null,
        ])->assertOk();

        $this->assertNull($this->getJson('/api/v1/profile')->json('data.photo_url'));
    }

    public function test_certificate_image_attach(): void
    {
        $upload = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->post('/api/v1/admin/media', ['file' => UploadedFile::fake()->image('sertif.png')])
            ->assertCreated();

        $mediaId = $upload->json('data.id');

        $created = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/v1/admin/certificates', [
                'title' => 'LSP Junior Web Developer',
                'issuer' => 'LSP',
                'image_media_id' => $mediaId,
            ])
            ->assertCreated();

        $certId = $created->json('data.id');

        $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson("/api/v1/admin/certificates/{$certId}")
            ->assertOk()
            ->assertJsonPath('data.image_url', fn ($v) => $v !== null && $v !== '');
    }

    public function test_profile_photo_attach_triggers_resize_and_deletes_old_file(): void
    {
        \App\Models\Profile::create(['name' => 'Achmad', 'headline' => 'Developer']);

        $auth = ['Authorization' => "Bearer {$this->token}"];

        $first = $this->withHeaders($auth)->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('satu.png', 2000, 2000),
        ])->json('data');

        $this->assertSame(2000, $first['width']);
        $this->assertSame(2000, $first['height']);

        $pathFirst = \App\Models\Media::find($first['id'])->path;
        $this->assertTrue(Storage::disk('public')->exists($pathFirst));

        $this->withHeaders($auth)->putJson('/api/v1/admin/profile', [
            'name' => 'Achmad',
            'headline' => 'Developer',
            'photo_media_id' => $first['id'],
        ])->assertOk();

        // Setelah terikat dan di-resize, file ukuran & dimensi harus mengecil.
        $mediaFirst = \App\Models\Media::find($first['id'])->fresh();
        $this->assertLessThan(2000, $mediaFirst->width);
        $this->assertLessThan(2000, $mediaFirst->height);

        // Upload & pasang foto kedua → foto pertama akan ter-detach + file fisiknya dihapus.
        $second = $this->withHeaders($auth)->post('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->image('dua.png', 1500, 1500),
        ])->json('data');

        $this->withHeaders($auth)->putJson('/api/v1/admin/profile', [
            'name' => 'Achmad',
            'headline' => 'Developer',
            'photo_media_id' => $second['id'],
        ])->assertOk();

        $this->assertFalse(Storage::disk('public')->exists($pathFirst), 'Foto lama harus dihapus');

        $mediaSecond = \App\Models\Media::find($second['id'])->fresh();
        $this->assertSame(\App\Models\Profile::class, $mediaSecond->model_type);
        $this->assertSame(1, (int) $mediaSecond->model_id);
    }
}
