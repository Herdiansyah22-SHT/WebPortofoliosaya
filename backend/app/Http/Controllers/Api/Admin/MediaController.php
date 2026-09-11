<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Support\ApiResponse;
use App\Support\ImageProcessor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    private const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    public function index(Request $request): JsonResponse
    {
        $paginator = Media::latest()->paginate(min(max($request->integer('per_page', 24), 1), 100));

        return ApiResponse::success(
            MediaResource::collection($paginator->items()),
            'Daftar media.',
            200,
            $this->meta($paginator)
        );
    }

    public function store(MediaRequest $request): JsonResponse
    {
        $file = $request->file('file');

        if (! in_array($file->getMimeType(), self::ALLOWED_MIMES, true)) {
            return ApiResponse::error('Tipe file tidak diizinkan.', ['file' => ['Format file tidak valid.']], 422);
        }

        if (! is_array($image = @getimagesize($file->getRealPath()))) {
            return ApiResponse::error('File bukan gambar valid.', ['file' => ['File bukan gambar valid.']], 422);
        }

        $path = $file->store('uploads', 'public');

        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $image[0],
            'height' => $image[1],
            'collection' => $request->input('collection', 'default'),
            'alt_text' => $request->input('alt_text'),
        ]);

        return ApiResponse::success(new MediaResource($media), 'Media diunggah.', 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);
        ImageProcessor::deletePhysical($media->disk, $media->path);
        $media->delete();

        return ApiResponse::success(null, 'Media dihapus.');
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
