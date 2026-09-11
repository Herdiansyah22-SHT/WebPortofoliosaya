<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'seo.default_title' => ['nullable', 'string', 'max:191'],
            'seo.default_description' => ['nullable', 'string', 'max:500'],
            'seo.default_og_type' => ['nullable', 'string', 'max:64'],
            'seo.default_og_image' => ['nullable', 'string', 'max:191'],
            'seo.robots_txt' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
