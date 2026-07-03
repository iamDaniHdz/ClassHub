<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'paternal_surname' => $this->paternal_surname,
            'maternal_surname' => $this->maternal_surname,
            'classroom_id' => $this->classroom_id,
        ];
    }
}
