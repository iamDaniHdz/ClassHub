<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'email' => $this->email,

            'role' => [
                'id' => $this->role?->id,
                'name' => $this->role?->name,
                'key' => $this->role?->key,
            ],

            'teacher_profile' => $this->teacherProfile
                ? [
                    'full_name' => $this->teacherProfile->full_name,
                    'first_name' => $this->teacherProfile->first_name,
                    'middle_name' => $this->teacherProfile->middle_name,
                    'paternal_surname' => $this->teacherProfile->paternal_surname,
                    'maternal_surname' => $this->teacherProfile->maternal_surname,
                    'career' => $this->teacherProfile->career,
                    'degree' => $this->teacherProfile->degree,
                    'specialty' => $this->teacherProfile->specialty,
                    'phone' => $this->teacherProfile->phone,
                    'photo' => $this->teacherProfile->photo,
                ]
                : null,

            'academies' => $this->academies_summary,
        ];
    }
}