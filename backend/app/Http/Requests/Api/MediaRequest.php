<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class MediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'],
            'collection' => ['nullable', 'string', 'max:64'],
            'alt_text' => ['nullable', 'string', 'max:191'],
        ];
    }
}
