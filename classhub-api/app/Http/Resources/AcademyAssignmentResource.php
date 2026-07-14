<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcademyAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'academy' => new AcademyResource($this->whenLoaded('academy')),
            'classroom' => new ClassroomResource($this->whenLoaded('classroom')),
            'teacher' => $this->whenLoaded('teacher', fn () => [

                'id' => $this->teacher->id,

                'email' => $this->teacher->email,

                'name' => $this->teacher->display_name,

                'profile' => $this->teacher->teacherProfile
                    ? [
                        'first_name' => $this->teacher->teacherProfile->first_name,

                        'middle_name' => $this->teacher->teacherProfile->middle_name,

                        'paternal_surname' => $this->teacher->teacherProfile->paternal_surname,

                        'maternal_surname' => $this->teacher->teacherProfile->maternal_surname,

                        'employee_number' => $this->teacher->teacherProfile->employee_number,

                        'degree' => $this->teacher->teacherProfile->degree,

                        'career' => $this->teacher->teacherProfile->career,

                        'specialty' => $this->teacher->teacherProfile->specialty,

                        'phone' => $this->teacher->teacherProfile->phone,

                        'photo' => $this->teacher->teacherProfile->photo,
                    ]
                    : null,
            ]),
        ];
    }
}
