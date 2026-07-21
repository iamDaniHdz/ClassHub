<?php

namespace App\Listeners;

use App\Events\StudentMoved;
use App\Models\AcademyAssignment;
use App\Models\StudentAssignment;

class RebuildStudentAssignments
{
    public function handle(
        StudentMoved $event
    ): void {

        $student = $event->student;

        StudentAssignment::where(
            'student_id',
            $student->id
        )->delete();

        $assignments = AcademyAssignment::where(
            'classroom_id',
            $student->classroom_id
        )->get();

        foreach ($assignments as $assignment) {

            StudentAssignment::firstOrCreate([
                'student_id' => $student->id,
                'academy_assignment_id' => $assignment->id,
            ]);
        }
    }
}
