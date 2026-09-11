<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\EducationRequest;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Education::when($request->string('search')->toString(), fn ($q, $search) => $q->where('institution', 'like', "%{$search}%"))
            ->orderBy('start_year', 'desc')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(EducationResource::collection($items->items()), 'Daftar education.', 200, $this->meta($items));
    }

    public function store(EducationRequest $request): JsonResponse
    {
        $education = Education::create($request->validated());

        return ApiResponse::success(new EducationResource($education), 'Education dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new EducationResource(Education::findOrFail($id)), 'Detail education.');
    }

    public function update(EducationRequest $request, int $id): JsonResponse
    {
        $education = Education::findOrFail($id);
        $education->update($request->validated());

        return ApiResponse::success(new EducationResource($education), 'Education diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Education::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Education dihapus.');
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
