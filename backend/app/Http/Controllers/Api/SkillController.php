<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            SkillResource::collection(Skill::active()->get()),
            'Daftar skill.'
        );
    }
}
