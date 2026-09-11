<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\TransientToken;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials)) {
            return ApiResponse::error('Email atau password salah.', [], 401);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        return ApiResponse::success([
            'user' => $this->authPayload($user),
        ], 'Login berhasil.');
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ApiResponse::success(null, 'Logout berhasil.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success([
            'user' => $this->authPayload($request->user()),
        ], 'Authenticated user.');
    }

    private function authPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->all(),
            'permissions' => $user->getAllPermissions()->pluck('name')->all(),
        ];
    }
}
