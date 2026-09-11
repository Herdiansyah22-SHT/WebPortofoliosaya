<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;
use App\Support\ImageProcessor;

class Media extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::deleted(function ($media) {
            // Delete the physical file when the media record is deleted.
            ImageProcessor::deletePhysical($media->disk, $media->path);
        });
    }

    protected $fillable = [
        'model_type',
        'model_id',
        'collection',
        'name',
        'path',
        'disk',
        'mime_type',
        'size',
        'width',
        'height',
        'alt_text',
    ];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function url(): string
    {
        // Root-relative agar gambar selalu dimuat dari origin yang sedang dibuka
        // (Vite dev 5173 / Laravel 8000 / production), tanpa terpaku APP_URL.
        return '/storage/'.ltrim($this->path, '/');
    }

    /**
     * Attach a media to a model.
     *
     * @param  Model  $owner
     * @param  int  $mediaId
     * @param  string  $collection
     * @param  bool  $detachOthers  Whether to detach other media in the same collection for the owner
     * @return void
     */
    public static function attachTo(Model $owner, int $mediaId, string $collection, bool $detachOthers = true): void
    {
        $media = self::findOrFail($mediaId);

        if ($detachOthers) {
            // Detach and delete physical file of other media in the same collection for this owner.
            self::where('model_type', $owner->getMorphClass())
                ->where('model_id', $owner->getKey())
                ->where('collection', $collection)
                ->where('id', '!=', $media->id)
                ->get()
                ->each(function ($stale) {
                    ImageProcessor::deletePhysical($stale->disk, $stale->path);
                    $stale->update(['model_type' => null, 'model_id' => null]);
                });
        }

        $media->update([
            'model_type' => $owner->getMorphClass(),
            'model_id' => $owner->getKey(),
            'collection' => $collection,
        ]);

        // Resize according to collection rules to avoid storage/load time,
        // then update the dimensions in the record.
        self::resizeForCollection($media, $collection);
    }

    /**
     * Resize file media di storage berdasarkan koleksi.
     */
    public static function resizeForCollection(Media $media, string $collection): void
    {
        try {
            $absolutePath = Storage::disk($media->disk)->path($media->path);
        } catch (\Throwable $e) {
            return;
        }

        if (! is_file($absolutePath)) {
            return;
        }

        $imageInfo = @getimagesize($absolutePath);
        if ($imageInfo === false) {
            return;
        }

        [$width, $height] = $imageInfo;
        [$maxW, $maxH] = match ($collection) {
            'profile_photo' => [ImageProcessor::MAX_PROFILE_WIDTH, ImageProcessor::MAX_PROFILE_HEIGHT],
            'certificate_image' => [ImageProcessor::MAX_CERT_WIDTH, ImageProcessor::MAX_CERT_HEIGHT],
            'thumbnail' => [ImageProcessor::MAX_THUMB_WIDTH, ImageProcessor::MAX_THUMB_HEIGHT],
            'gallery' => [ImageProcessor::MAX_THUMB_WIDTH, ImageProcessor::MAX_THUMB_HEIGHT],
            default => [0, 0],
        };

        if ($maxW === 0 || ($width <= $maxW && $height <= $maxH)) {
            return;
        }

        $ratio = min($maxW / $width, $maxH / $height);
        $newWidth = (int) floor($width * $ratio);
        $newHeight = (int) floor($height * $ratio);

        $source = match ($imageInfo[2]) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($absolutePath),
            IMAGETYPE_PNG => @imagecreatefrompng($absolutePath),
            IMAGETYPE_GIF => @imagecreatefromgif($absolutePath),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($absolutePath) : null,
            default => null,
        };
        if ($source === null) {
            return;
        }

        $canvas = imagecreatetruecolor($newWidth, $newHeight);
        if ($canvas === false) {
            imagedestroy($source);
            return;
        }

        if (in_array($imageInfo[2], [IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefilledrectangle($canvas, 0, 0, $newWidth, $newHeight, $transparent);
        }

        imagecopyresampled($canvas, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $tempPath = $absolutePath . '.tmp';
        $written = match ($imageInfo[2]) {
            IMAGETYPE_JPEG => imagejpeg($canvas, $tempPath, ImageProcessor::JPEG_QUALITY),
            IMAGETYPE_PNG => imagepng($canvas, $tempPath, 6),
            IMAGETYPE_WEBP => function_exists('imagewebp') ? imagewebp($canvas, $tempPath, ImageProcessor::JPEG_QUALITY) : imagejpeg($canvas, $tempPath, ImageProcessor::JPEG_QUALITY),
            IMAGETYPE_GIF => imagegif($canvas, $tempPath),
            default => imagejpeg($canvas, $tempPath, ImageProcessor::JPEG_QUALITY),
        };

        imagedestroy($source);
        imagedestroy($canvas);

        if ($written) {
            @rename($tempPath, $absolutePath);
            // Update dimensi di record (di-handle apa pun hasil rename).
            $refreshInfo = @getimagesize($absolutePath);
            $media->update([
                'width' => $refreshInfo[0] ?? $width,
                'height' => $refreshInfo[1] ?? $height,
            ]);
        } else {
            @unlink($tempPath);
        }
    }
}
