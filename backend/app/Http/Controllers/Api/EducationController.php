<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class EducationController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            EducationResource::collection(Education::active()->get()),
            'Daftar pendidikan.'
        );
    }
}
