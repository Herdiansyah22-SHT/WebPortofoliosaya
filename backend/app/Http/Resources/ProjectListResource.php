<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'thumbnail_url' => $this->media()->where('collection', 'thumbnail')->first()?->url(),
            'technologies' => $this->technologies->pluck('name'),
            'is_featured' => $this->is_featured,
            'status' => $this->status->value,
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
