<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            ExperienceResource::collection(Experience::active()->get()),
            'Daftar pengalaman.'
        );
    }
}
