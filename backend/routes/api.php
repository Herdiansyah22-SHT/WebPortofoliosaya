<?php

use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\EducationController as AdminEducationController;
use App\Http\Controllers\Api\Admin\ExperienceController as AdminExperienceController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\SeoController as AdminSeoController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Api\Admin\TagController as AdminTagController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SkillController;
use App\Support\ApiResponse;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('health', fn () => ApiResponse::success([
        'service' => config('app.name'),
        'status' => 'ok',
        'time' => now()->toISOString(),
    ], 'Service healthy'));

    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    Route::get('profile', [ProfileController::class, 'show']);
    Route::get('site', [SiteController::class, 'show']);
    Route::get('skills', [SkillController::class, 'index']);
    Route::get('experiences', [ExperienceController::class, 'index']);
    Route::get('educations', [EducationController::class, 'index']);
    Route::get('certificates', [CertificateController::class, 'index']);
    Route::get('projects', [ProjectController::class, 'index']);
    Route::get('projects/{slug}', [ProjectController::class, 'show']);
    Route::get('posts', [PostController::class, 'index']);
    Route::get('posts/{slug}', [PostController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact');

    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->middleware('permission:dashboard.view');

        Route::get('profile', [AdminProfileController::class, 'show']);
        Route::put('profile', [AdminProfileController::class, 'update'])->middleware('permission:profile.update');

        $crud = function (
            string $uri,
            string $controller,
            array $permissions,
        ): void {
            [$view, $create, $update, $delete] = $permissions;

            Route::get($uri, [$controller, 'index'])->middleware('permission:'.$view);
            Route::post($uri, [$controller, 'store'])->middleware('permission:'.$create);
            Route::get($uri.'/{id}', [$controller, 'show'])->middleware('permission:'.$view);
            Route::match(['put', 'patch'], $uri.'/{id}', [$controller, 'update'])->middleware('permission:'.$update);
            Route::delete($uri.'/{id}', [$controller, 'destroy'])->middleware('permission:'.$delete);
        };

        $crud('skills', AdminSkillController::class, ['skills.view', 'skills.create', 'skills.update', 'skills.delete']);
        $crud('projects', AdminProjectController::class, ['projects.view', 'projects.create', 'projects.update', 'projects.delete']);
        $crud('experiences', AdminExperienceController::class, ['experience.view', 'experience.create', 'experience.update', 'experience.delete']);
        $crud('educations', AdminEducationController::class, ['education.view', 'education.create', 'education.update', 'education.delete']);
        $crud('certificates', AdminCertificateController::class, ['certificates.view', 'certificates.create', 'certificates.update', 'certificates.delete']);
        $crud('posts', AdminPostController::class, ['posts.view', 'posts.create', 'posts.update', 'posts.delete']);
        $crud('categories', AdminCategoryController::class, ['posts.view', 'posts.create', 'posts.update', 'posts.delete']);
        $crud('tags', AdminTagController::class, ['posts.view', 'posts.create', 'posts.update', 'posts.delete']);

        Route::get('media', [AdminMediaController::class, 'index'])->middleware('permission:media.view');
        Route::post('media', [AdminMediaController::class, 'store'])->middleware(['permission:media.upload', 'throttle:media']);
        Route::delete('media/{id}', [AdminMediaController::class, 'destroy'])->middleware('permission:media.delete');

        Route::get('messages', [AdminMessageController::class, 'index'])->middleware('permission:messages.view');
        Route::get('messages/{id}', [AdminMessageController::class, 'show'])->middleware('permission:messages.view');
        Route::put('messages/{id}', [AdminMessageController::class, 'update'])->middleware('permission:messages.update');
        Route::delete('messages/{id}', [AdminMessageController::class, 'destroy'])->middleware('permission:messages.delete');

        Route::get('seo', [AdminSeoController::class, 'index'])->middleware('permission:seo.view');
        Route::put('seo', [AdminSeoController::class, 'update'])->middleware('permission:seo.update');

        Route::get('settings', [AdminSettingController::class, 'index'])->middleware('permission:settings.view');
        Route::put('settings', [AdminSettingController::class, 'update'])->middleware('permission:settings.update');
    });
});
