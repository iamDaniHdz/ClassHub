<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'name' => $this->name,

            'email' => $this->email,

            'role' => [

                'id' => $this->role?->id,

                'key' => $this->role?->key,

                'name' => $this->role?->name,
            ],

            'schools' => $this->whenLoaded(
                'schools',
                fn () => $this->schools->map(
                    fn ($school) => [

                        'id' => $school->id,

                        'name' => $school->name,
                    ]
                )
            ),

            'teacher_profile' => $this->whenLoaded(
                'teacherProfile',
                fn () => [

                    'id' => $this->teacherProfile?->id,

                    'full_name' => $this->teacherProfile?->full_name,

                    'employee_number' => $this->teacherProfile?->employee_number,
                ]
            ),

        ];
    }
}