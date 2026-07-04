<?php

namespace App\Listeners;

use App\Events\StudentCreated;
use App\Models\StudentAssignment;
use App\Models\AcademyAssignment;

class AssignStudentToAcademies
{
    public function handle(StudentCreated $event): void
    {
        $student = $event->student;

        // obtener todas las academias del salón
        $assignments = AcademyAssignment::where(
            'classroom_id',
            $student->classroom_id
        )->get();

        foreach ($assignments as $assignment) {

            StudentAssignment::firstOrCreate([
                'student_id' => $student->id,
                'academy_assignment_id' => $assignment->id
            ]);
        }
    }
}