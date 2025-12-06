<?php

namespace App\Http\Requests\Todo;

use Illuminate\Foundation\Http\FormRequest;

class TodoIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'sort_by' => 'nullable|string',
            'sort_order' => 'nullable|in:asc,desc'
        ];
    }

    public function attributes(): array
    {
        return [
            'page' => 'Page',
            'limit' => 'Limit',
            'search' => 'Search'
        ];
    }
}
