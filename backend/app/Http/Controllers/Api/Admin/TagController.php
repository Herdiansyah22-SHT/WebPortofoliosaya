<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\TagRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(TagResource::collection(Tag::orderBy('name')->get()), 'Daftar tag.');
    }

    public function store(TagRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return ApiResponse::success(new TagResource(Tag::create($data)), 'Tag dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new TagResource(Tag::findOrFail($id)), 'Detail tag.');
    }

    public function update(TagRequest $request, int $id): JsonResponse
    {
        $tag = Tag::findOrFail($id);
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $tag->update($data);

        return ApiResponse::success(new TagResource($tag), 'Tag diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Tag::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Tag dihapus.');
    }
}
