<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectListResource;
use App\Models\Project;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::published()->with('technologies');

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('summary', 'like', "%{$search}%"));
        }

        $paginator = $query->latest('published_at')->paginate(min(max($request->integer('per_page', 9), 1), 100))->withQueryString();

        return ApiResponse::success(
            ProjectListResource::collection($paginator->items()),
            'Daftar project published.',
            200,
            $this->paginationMeta($paginator)
        );
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::with(['technologies', 'seoMetadata'])->published()->where('slug', $slug)->firstOrFail();

        return ApiResponse::success(new ProjectDetailResource($project), 'Detail project.');
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
