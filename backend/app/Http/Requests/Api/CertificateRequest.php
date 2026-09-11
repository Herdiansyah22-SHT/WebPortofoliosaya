<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:191'],
            'issuer' => ['required', 'string', 'max:191'],
            'credential_id' => ['nullable', 'string', 'max:191'],
            'credential_url' => ['nullable', 'url', 'max:191'],
            'issued_date' => ['nullable', 'date'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:issued_date'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
            'image_media_id' => ['nullable', 'integer', 'exists:media,id'],
        ];
    }
}
