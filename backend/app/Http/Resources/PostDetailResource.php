<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'cover_url' => $this->media()->where('collection', 'cover')->first()?->url(),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null),
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])->all()),
            'author' => $this->whenLoaded('author', fn () => $this->author ? [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ] : null),
            'reading_time' => $this->reading_time,
            'status' => $this->status->value,
            'published_at' => $this->published_at?->toISOString(),
            'seo' => $this->whenLoaded('seoMetadata', fn () => [
                'title' => $this->seoMetadata?->title,
                'description' => $this->seoMetadata?->description,
                'og_image' => $this->seoMetadata?->og_image,
            ]),
        ];
    }
}
