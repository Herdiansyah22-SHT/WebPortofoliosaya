<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * ImageProcessor — utilitas pemrosesan gambar tanpa dependency eksternal.
 * Menggunakan PHP GD bawaan untuk resize + optimasi gambar.
 */
class ImageProcessor
{
    public const MAX_PROFILE_WIDTH = 800;
    public const MAX_PROFILE_HEIGHT = 800;
    public const MAX_CERT_WIDTH = 1200;
    public const MAX_CERT_HEIGHT = 1200;
    public const MAX_THUMB_WIDTH = 1200;
    public const MAX_THUMB_HEIGHT = 1200;
    public const JPEG_QUALITY = 85;

    /**
     * Hapus file fisik di storage (jika ada). Aman dipanggil saat record sudah dihapus.
     */
    public static function deletePhysical(string $disk, ?string $path): void
    {
        if (! $path) {
            return;
        }
        try {
            if (Storage::disk($disk)->exists($path)) {
                Storage::disk($disk)->delete($path);
            }
        } catch (\Throwable $e) {
            \Log::warning('ImageProcessor gagal hapus file: '.$e->getMessage());
        }
    }
}