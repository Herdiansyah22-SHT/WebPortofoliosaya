<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:191'],
            'headline' => ['required', 'string', 'max:191'],
            'bio' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:191'],
            'email' => ['nullable', 'email', 'max:191'],
            'phone' => ['nullable', 'string', 'max:32'],
            'is_available' => ['boolean'],
            'social_links' => ['nullable', 'array'],
            'social_links.*' => ['nullable', 'url', 'max:191'],
            'resume_path' => ['nullable', 'string', 'max:191'],
            'photo_media_id' => ['nullable', 'integer', 'exists:media,id'],
        ];
    }
}
