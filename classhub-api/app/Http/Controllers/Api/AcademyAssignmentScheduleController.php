<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademyAssignment;
use App\Models\AcademyAssignmentSchedule;
use Illuminate\Http\Request;

class AcademyAssignmentScheduleController extends Controller
{
    /**
     * Listar horarios
     */
    public function index(
        AcademyAssignment $academyAssignment
    )
    {
        return response()->json([

            'success' => true,

            'data' => $academyAssignment
                ->schedules()
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get(),
        ]);
    }

    /**
     * Crear horario
     */
    public function store(
        Request $request
    )
    {
        $data = $request->validate([

            'academy_assignment_id' => [
                'required',
                'exists:academy_assignments,id',
            ],

            'day_of_week' => [
                'required',
                'integer',
                'between:1,7',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
            ],
        ]);

        if (
            $data['start_time']
            >=
            $data['end_time']
        ) {

            abort(
                422,
                'End time must be greater than start time'
            );
        }

        /**
         * Validación de duplicado exacto
         */
        $exists = AcademyAssignmentSchedule::where([

            'academy_assignment_id'
                => $data['academy_assignment_id'],

            'day_of_week'
                => $data['day_of_week'],

            'start_time'
                => $data['start_time'],

            'end_time'
                => $data['end_time'],
        ])->exists();

        if ($exists) {

            abort(
                422,
                'Schedule already exists'
            );
        }

        $schedule =
            AcademyAssignmentSchedule::create(
                $data
            );

        return response()->json([

            'success' => true,

            'data' => $schedule,

        ], 201);
    }

    /**
     * Eliminar horario
     */
    public function destroy(
        AcademyAssignmentSchedule $academyAssignmentSchedule
    )
    {
        $academyAssignmentSchedule->delete();

        return response()->json([

            'success' => true,
        ]);
    }
}