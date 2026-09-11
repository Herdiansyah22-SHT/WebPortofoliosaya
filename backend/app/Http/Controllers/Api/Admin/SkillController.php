<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Skill::query();

        if ($search = $request->string('search')->toString()) {
            $query->where('name', 'like', "%{$search}%");
        }

        $skills = $query->orderBy('sort_order')->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(SkillResource::collection($skills->items()), 'Daftar skill.', 200, $this->meta($skills));
    }

    public function store(SkillRequest $request): JsonResponse
    {
        $skill = Skill::create($request->validated());

        return ApiResponse::success(new SkillResource($skill), 'Skill dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new SkillResource(Skill::findOrFail($id)), 'Detail skill.');
    }

    public function update(SkillRequest $request, int $id): JsonResponse
    {
        $skill = Skill::findOrFail($id);
        $skill->update($request->validated());

        return ApiResponse::success(new SkillResource($skill), 'Skill diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Skill::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Skill dihapus.');
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
