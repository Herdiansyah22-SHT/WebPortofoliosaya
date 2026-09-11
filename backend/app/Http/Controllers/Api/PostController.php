<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostDetailResource;
use App\Http\Resources\PostListResource;
use App\Models\Post;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::published()->with(['tags', 'category']);

        if ($category = $request->string('category')->toString()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%"));
        }

        $paginator = $query->latest('published_at')->paginate(min(max($request->integer('per_page', 9), 1), 100))->withQueryString();

        return ApiResponse::success(
            PostListResource::collection($paginator->items()),
            'Daftar post published.',
            200,
            $this->paginationMeta($paginator)
        );
    }

    public function show(string $slug): JsonResponse
    {
        $post = Post::with(['tags', 'category', 'author', 'seoMetadata'])->published()->where('slug', $slug)->firstOrFail();

        return ApiResponse::success(new PostDetailResource($post), 'Detail post.');
    }

    private function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }
}
