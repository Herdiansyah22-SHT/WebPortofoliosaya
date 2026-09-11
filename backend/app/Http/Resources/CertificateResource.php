<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->media()->where('collection', 'certificate_image')->first();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'issuer' => $this->issuer,
            'credential_id' => $this->credential_id,
            'credential_url' => $this->credential_url,
            'issued_date' => $this->issued_date?->toDateString(),
            'expiration_date' => $this->expiration_date?->toDateString(),
            'image_url' => $image?->url(),
            'is_active' => $this->is_active,
        ];
    }
}
