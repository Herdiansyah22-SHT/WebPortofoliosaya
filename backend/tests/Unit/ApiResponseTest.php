<?php

namespace Tests\Unit;

use App\Support\ApiResponse;
use Tests\TestCase;

class ApiResponseTest extends TestCase
{
    public function test_success_shape(): void
    {
        $response = ApiResponse::success(['id' => 1], 'Resource dibuat', 201);
        $content = $response->getContent();

        $this->assertSame(201, $response->getStatusCode());
        $this->assertJson($content);
        $this->assertSame([
            'success' => true,
            'message' => 'Resource dibuat',
            'data' => ['id' => 1],
        ], json_decode($content, true));
    }

    public function test_error_shape(): void
    {
        $response = ApiResponse::error('Validasi gagal', ['email' => ['Format email salah']], 422);

        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => ['email' => ['Format email salah']],
        ], json_decode($response->getContent(), true));
    }
}
