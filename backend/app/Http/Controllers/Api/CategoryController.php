<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            CategoryResource::collection(Category::where('is_active', true)->orderBy('sort_order')->get()),
            'Daftar kategori.'
        );
    }
}
