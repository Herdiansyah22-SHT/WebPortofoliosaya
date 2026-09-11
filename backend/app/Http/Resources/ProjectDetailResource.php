<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'thumbnail_url' => $this->media()->where('collection', 'thumbnail')->first()?->url(),
            'gallery_urls' => $this->media()->where('collection', 'gallery')->get()->map->url(),
            'technologies' => $this->technologies->pluck('name'),
            'live_url' => $this->live_url,
            'repo_url' => $this->repo_url,
            'is_featured' => $this->is_featured,
            'status' => $this->status->value,
            'sort_order' => $this->sort_order,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'published_at' => $this->published_at?->toISOString(),
            'seo' => $this->whenLoaded('seoMetadata', fn () => [
                'title' => $this->seoMetadata?->title,
                'description' => $this->seoMetadata?->description,
                'og_image' => $this->seoMetadata?->og_image,
            ]),
        ];
    }
}
