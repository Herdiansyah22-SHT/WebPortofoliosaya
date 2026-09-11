<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CertificateRequest;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Models\Media;
use App\Support\ApiResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Certificate::when($request->string('search')->toString(), fn ($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->orderBy('issued_date', 'desc')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::success(CertificateResource::collection($items->items()), 'Daftar sertifikat.', 200, $this->meta($items));
    }

    public function store(CertificateRequest $request): JsonResponse
    {
        $certificate = Certificate::create(
            collect($request->validated())->except(['image_media_id'])->all()
        );

        if ($request->has('image_media_id') && $request->filled('image_media_id')) {
            Media::attachTo($certificate, (int) $request->integer('image_media_id'), 'certificate_image');
        }

        return ApiResponse::success(new CertificateResource($certificate), 'Sertifikat dibuat.', 201);
    }

    public function show(int $id): JsonResponse
    {
        return ApiResponse::success(new CertificateResource(Certificate::findOrFail($id)), 'Detail sertifikat.');
    }

    public function update(CertificateRequest $request, int $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->update(
            collect($request->validated())->except(['image_media_id'])->all()
        );

        if ($request->has('image_media_id') && $request->filled('image_media_id')) {
            Media::attachTo($certificate, (int) $request->integer('image_media_id'), 'certificate_image');
        }

        return ApiResponse::success(new CertificateResource($certificate), 'Sertifikat diperbarui.');
    }

    public function destroy(int $id): JsonResponse
    {
        Certificate::findOrFail($id)->delete();

        return ApiResponse::success(null, 'Sertifikat dihapus.');
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
