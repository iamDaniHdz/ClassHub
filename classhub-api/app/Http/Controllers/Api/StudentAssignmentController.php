<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentAssignmentRequest;
use App\Http\Resources\StudentResource;
use App\Models\StudentAssignment;
use Illuminate\Http\Request;

class StudentAssignmentController extends Controller
{
    public function store(StoreStudentAssignmentRequest $request)
    {
        $data = $request->validated();

        $exists = StudentAssignment::where($data)->exists();

        if ($exists) {
            abort(422, 'Student already assigned to this academy');
        }

        $assignment = StudentAssignment::create($data);

        return response()->json([
            'success' => true,
            'data' => $assignment
        ], 201);
    }    

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $studentAssignment = StudentAssignment::with([
            'student',
            'assignment.academy',
            'assignment.classroom',
            'attendances',
            'grades',
            'submissions',
        ])->findOrFail($id);

        // Multi-tenant validation
        $schoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array(
            $studentAssignment->assignment->classroom->school_id,
            $schoolIds
        )) {
            abort(403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                
                'student' => new StudentResource(
                    $studentAssignment->student
                ),

                'academy' => $studentAssignment->assignment->academy->name,
                'classroom' => $studentAssignment->assignment->classroom->name,

                'attendances_count' => $studentAssignment->attendances
                    ->where('status', 'absent')
                    ->count(),

                'grades' => $studentAssignment->grades,
                'submissions' => $studentAssignment->submissions,
            ]
        ]);
    }
}
