<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(
            CertificateResource::collection(Certificate::active()->get()),
            'Daftar sertifikat.'
        );
    }
}
