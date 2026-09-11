<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ExperienceRequest;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Experience::query();

        if ($search = $request->string('search')->toString()) {
            $query->where('company', 'like', "%{$search}%")
                ->orWhere('position', 'like', "%{$search}%");
        }

        $items = $query->orderBy('start_date', 'desc')->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(ExperienceResource::collection($items->items()), 'Daftar experience.', 200, $this->meta($items));
    }

    public function store(ExperienceRequest $request): JsonResponse
    {
        $experience = Experience::create($request->validated());

        return ApiResponse::success(new ExperienceResource($experience), 'Experience dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new ExperienceResource(Experience::findOrFail($id)), 'Detail experience.');
    }

    public function update(ExperienceRequest $request, int $id): JsonResponse
    {
        $experience = Experience::findOrFail($id);
        $experience->update($request->validated());

        return ApiResponse::success(new ExperienceResource($experience), 'Experience diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Experience::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Experience dihapus.');
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
