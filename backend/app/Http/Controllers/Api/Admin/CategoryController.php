<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Category::when($request->string('search')->toString(), fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('sort_order')
            ->get();

        return ApiResponse::success(CategoryResource::collection($items), 'Daftar kategori.');
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return ApiResponse::success(new CategoryResource(Category::create($data)), 'Kategori dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new CategoryResource(Category::findOrFail($id)), 'Detail kategori.');
    }

    public function update(CategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $category->update($data);

        return ApiResponse::success(new CategoryResource($category), 'Kategori diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Category::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Kategori dihapus.');
    }
}
