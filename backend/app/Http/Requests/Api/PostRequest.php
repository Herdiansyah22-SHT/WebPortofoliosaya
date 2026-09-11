<?php

namespace App\Http\Requests\Api;

use App\Enums\ContentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:191'],
            'slug' => ['nullable', 'string', 'max:191', Rule::unique('posts', 'slug')->ignore($this->route('id'))],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string', Rule::requiredIf($this->input('status') === 'published')],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'status' => ['required', Rule::enum(ContentStatus::class)],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
        ];
    }
}
