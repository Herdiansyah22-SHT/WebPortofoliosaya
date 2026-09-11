<?php

namespace App\Models;

use App\Enums\ContentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Project extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::deleting(function ($project) {
            $project->technologies()->delete();
            $project->seoMetadata()->delete();
            
            // Delete all associated media files and records
            $project->media()->each(function ($media) {
                \App\Support\ImageProcessor::deletePhysical($media->disk, $media->path);
                $media->delete();
            });
        });
    }

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'live_url',
        'repo_url',
        'status',
        'is_featured',
        'sort_order',
        'start_date',
        'end_date',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContentStatus::class,
            'is_featured' => 'boolean',
            'start_date' => 'date',
            'end_date' => 'date',
            'published_at' => 'datetime',
        ];
    }

    public function technologies(): HasMany
    {
        return $this->hasMany(ProjectTechnology::class)->orderBy('sort_order');
    }

    public function seoMetadata(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'model');
    }

    public function thumbnail()
    {
        return $this->media()->where('collection', 'thumbnail')->first();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ContentStatus::Published)
            ->where(fn (Builder $q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()));
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }
}
