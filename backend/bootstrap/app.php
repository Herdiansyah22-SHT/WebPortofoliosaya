<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\SecurityHeaders;
use App\Support\ApiResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(SecurityHeaders::class);
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'auth' => Authenticate::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $status = match (true) {
                $e instanceof ValidationException => 422,
                $e instanceof AuthenticationException => 401,
                $e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException => 404,
                $e instanceof HttpException => $e->getStatusCode(),
                default => 500,
            };

            if ($e instanceof ValidationException) {
                return ApiResponse::error('Validasi gagal', $e->errors(), 422);
            }

            $message = match (true) {
                $e instanceof AuthenticationException => 'Autentikasi diperlukan.',
                $status === 403 => 'Akses ditolak.',
                $e instanceof NotFoundHttpException => 'Resource tidak ditemukan.',
                $status === 429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
                $e instanceof HttpException => $e->getMessage() ?: 'Permintaan tidak valid.',
                default => 'Terjadi kesalahan server.',
            };

            return ApiResponse::error($message, [], $status);
        });
    })->create();
