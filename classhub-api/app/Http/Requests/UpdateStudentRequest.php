<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'second_name' => ['nullable','string','max:255',],
            'paternal_surname' => 'sometimes|required|string|max:255',
            'maternal_surname' => 'sometimes|required|string|max:255',
            'student_enrollment' => [

                'nullable',

                'string',

                'max:255',

                Rule::unique(
                    'students',
                    'student_enrollment'
                )
                ->where(
                    fn ($query) =>
                        $query->where(
                            'school_id',
                            $this->school_id,
                        )
                )
                ->ignore(
                    $this->route('student')
                )
            ],
            'is_active' => ['boolean',],
            'classroom_id' => 'sometimes|required|exists:classrooms,id',
        ];
    }

}
