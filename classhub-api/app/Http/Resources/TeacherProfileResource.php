<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeacherProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,

            'user_id' => $this->user_id,

            'full_name' => $this->full_name,

            'first_name' => $this->first_name,

            'middle_name' => $this->middle_name,

            'paternal_surname' => $this->paternal_surname,

            'maternal_surname' => $this->maternal_surname,

            'employee_number' => $this->employee_number,

            'degree' => $this->degree,

            'career' => $this->career,

            'specialty' => $this->specialty,

            'phone' => $this->phone,

            'photo' => $this->photo,
        ];
    }
}
