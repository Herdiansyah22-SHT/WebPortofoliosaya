<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'site.name' => ['required', 'string', 'max:191'],
            'site.tagline' => ['required', 'string', 'max:191'],
            'site.description' => ['nullable', 'string', 'max:500'],
            'site.social_links' => ['nullable', 'array'],
            'site.social_links.*' => ['nullable', 'url', 'max:191'],
        ];
    }
}
