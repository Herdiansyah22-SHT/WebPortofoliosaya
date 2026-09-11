<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $photo = $this->media()->where('collection', 'profile_photo')->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'location' => $this->location,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_available' => $this->is_available,
            'social_links' => $this->social_links,
            'resume_url' => $this->resume_path ? '/storage/'.ltrim($this->resume_path, '/') : null,
            'photo_url' => $photo?->url(),
            'seo' => $this->whenLoaded('seoMetadata'),
        ];
    }
}
