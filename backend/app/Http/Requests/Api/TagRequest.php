<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('tags', 'name')->ignore($this->route('id'))],
            'slug' => ['nullable', 'string', 'max:191', Rule::unique('tags', 'slug')->ignore($this->route('id'))],
        ];
    }
}
