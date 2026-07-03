<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'degree' => $this->degree,
            'group' => $this->group,
            'school_id' => $this->school_id,
            'students_count' => $this->students_count,
            'students' => StudentResource::collection(
                $this->whenLoaded('students')
            )

        ];
    }
}
