<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PostRequest;
use App\Http\Resources\PostListResource;
use App\Models\Post;
use App\Models\Tag;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['category', 'tags', 'author']);

        if ($search = $request->string('search')->toString()) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        $paginator = $query->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(
            PostListResource::collection($paginator->items()),
            'Daftar post.',
            200,
            $this->meta($paginator)
        );
    }

    public function store(PostRequest $request): JsonResponse
    {
        $post = Post::create($this->payload($request) + ['author_id' => $request->user()->id]);
        $this->syncTags($post, $request->input('tags', []));

        return ApiResponse::success(new PostListResource($post->load(['category', 'tags'])), 'Post dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(
            new PostListResource(Post::with(['category', 'tags', 'author'])->findOrFail($id)),
            'Detail post.'
        );
    }

    public function update(PostRequest $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        $post->update($this->payload($request));
        $this->syncTags($post, $request->input('tags', []));

        return ApiResponse::success(
            new PostListResource($post->load(['category', 'tags'])),
            'Post diperbarui.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        Post::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Post dihapus.');
    }

    private function payload(PostRequest $request): array
    {
        $data = collect($request->validated())->except(['tags'])->all();
        $data['slug'] = $request->input('slug') ?: Str::slug($request->input('title'));
        $data['reading_time'] = $this->computeReadingTime($request->input('body'));

        if ($request->input('status') === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }

    private function syncTags(Post $post, array $names): void
    {
        $ids = [];

        foreach (array_unique($names) as $name) {
            $name = trim($name);

            if ($name === '') {
                continue;
            }

            $tag = Tag::firstOrCreate(
                ['name' => $name],
                ['slug' => $this->uniqueTagSlug($name)]
            );

            $ids[] = $tag->id;
        }

        $post->tags()->sync($ids);
    }

    private function uniqueTagSlug(string $name): string
    {
        $slug = Str::slug($name) ?: 'tag';
        $candidate = $slug;
        $i = 1;

        while (Tag::where('slug', $candidate)->where('name', '!=', $name)->exists()) {
            $candidate = $slug.'-'.++$i;
        }

        return $candidate;
    }

    private function computeReadingTime(?string $body): ?int
    {
        if (! $body) {
            return null;
        }

        return max(1, (int) ceil(str_word_count(strip_tags($body)) / 200));
    }

    private function meta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];
    }
}
