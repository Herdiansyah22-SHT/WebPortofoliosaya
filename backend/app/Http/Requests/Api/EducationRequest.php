<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'institution' => ['required', 'string', 'max:191'],
            'degree' => ['nullable', 'string', 'max:191'],
            'field_of_study' => ['nullable', 'string', 'max:191'],
            'start_year' => ['required', 'integer', 'between:1900,2100'],
            'end_year' => ['nullable', 'integer', 'between:1900,2100', 'gte:start_year'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
