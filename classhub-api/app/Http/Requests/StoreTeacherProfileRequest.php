<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => [
                'required',
                'exists:users,id',
            ],

            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'paternal_surname' => [
                'required',
                'string',
                'max:255',
            ],

            'career' => [
                'nullable',
                'string',
                'max:255',
            ],

            'degree' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
