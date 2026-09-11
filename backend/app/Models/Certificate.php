<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Certificate extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::deleting(function ($certificate) {
            // Delete all associated media files and records
            $certificate->media()->each(function ($media) {
                \App\Support\ImageProcessor::deletePhysical($media->disk, $media->path);
                $media->delete();
            });
        });
    }

    protected $fillable = [
        'title',
        'issuer',
        'credential_id',
        'credential_url',
        'issued_date',
        'expiration_date',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'issued_date' => 'date',
            'expiration_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('issued_date', 'desc');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'model');
    }
}
