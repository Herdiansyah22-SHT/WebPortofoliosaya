<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ProjectRequest;
use App\Http\Resources\ProjectListResource;
use App\Models\Project;
use App\Models\Media;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::with('technologies');

        if ($search = $request->string('search')->toString()) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        $paginator = $query->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(
            ProjectListResource::collection($paginator->items()),
            'Daftar project.',
            200,
            $this->meta($paginator)
        );
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $project = \DB::transaction(function () use ($request) {
            $project = Project::create($this->payload($request));
            $this->syncTechnologies($project, $request->input('technologies', []));
            // Attach thumbnail
            if ($request->has('thumbnail_media_id')) {
                Media::attachTo($project, $request->input('thumbnail_media_id'), 'thumbnail');
            }
            // Attach gallery images
            if ($request->has('gallery_media_ids')) {
                // Determine media ids to keep
                $galleryMediaIds = $request->input('gallery_media_ids', []);
                
                // Detach media that are no longer part of the gallery
                $staleGallery = $project->media()
                    ->where('collection', 'gallery')
                    ->whereNotIn('id', $galleryMediaIds)
                    ->get();

                foreach ($staleGallery as $s) {
                    \App\Support\ImageProcessor::deletePhysical($s->disk, $s->path);
                    $s->update(['model_type' => null, 'model_id' => null]);
                }

                foreach ($galleryMediaIds as $mediaId) {
                    Media::attachTo($project, $mediaId, 'gallery', false);
                }
            }

            return $project;
        });

        return ApiResponse::success(new ProjectListResource($project->load('technologies')), 'Project dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(
            new ProjectListResource(Project::with('technologies')->findOrFail($id)),
            'Detail project.'
        );
    }

    public function update(ProjectRequest $request, int $id): JsonResponse
    {
        $project = \DB::transaction(function () use ($request, $id) {
            $project = Project::findOrFail($id);
            $project->update($this->payload($request, $project));
            $this->syncTechnologies($project, $request->input('technologies', []));
            
            // Attach thumbnail (attachTo otomatis hapus yg lama)
            if ($request->has('thumbnail_media_id')) {
                if ($mediaId = $request->input('thumbnail_media_id')) {
                    Media::attachTo($project, $mediaId, 'thumbnail');
                } else {
                    $stale = $project->media()->where('collection', 'thumbnail')->get();
                    foreach ($stale as $s) {
                        \App\Support\ImageProcessor::deletePhysical($s->disk, $s->path);
                        $s->update(['model_type' => null, 'model_id' => null]);
                    }
                }
            }

            // Sync gallery images: detach removed ones, attach new ones
            if ($request->has('gallery_media_ids')) {
                $galleryMediaIds = $request->input('gallery_media_ids', []);

                $staleGallery = $project->media()
                    ->where('collection', 'gallery')
                    ->whereNotIn('id', $galleryMediaIds)
                    ->get();

                foreach ($staleGallery as $s) {
                    \App\Support\ImageProcessor::deletePhysical($s->disk, $s->path);
                    $s->update(['model_type' => null, 'model_id' => null]);
                }

                foreach ($galleryMediaIds as $mediaId) {
                    Media::attachTo($project, $mediaId, 'gallery', false);
                }
            }

            return $project;
        });

        return ApiResponse::success(new ProjectListResource($project->load('technologies')), 'Project diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Project::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Project dihapus.');
    }

    private function payload(ProjectRequest $request, ?Project $existing = null): array
    {
        $data = collect($request->validated())->except(['technologies'])->all();
        $data['slug'] = $request->input('slug') ?: Str::slug($request->input('title'));

        if ($request->input('status') === 'published' && (! $existing || ! $existing->published_at)) {
            $data['published_at'] = now();
        } elseif (! $existing && $request->input('status') !== 'published') {
            $data['published_at'] = null;
        }

        return $data;
    }

    private function syncTechnologies(Project $project, array $names): void
    {
        $project->technologies()->delete();

        foreach (array_values($names) as $i => $name) {
            $project->technologies()->create(['name' => $name, 'sort_order' => $i]);
        }
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
