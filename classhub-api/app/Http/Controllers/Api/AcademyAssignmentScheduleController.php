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
            $data['start_time'] >=
            $data['end_time']
        ) {

            return response()->json([

                'success' => false,

                'message' =>
                    'La hora de fin debe ser mayor que la hora de inicio.'

            ], 422);
        }

        $assignment =
            AcademyAssignment::with([
                'classroom',
            ])
            ->findOrFail(
                $data['academy_assignment_id']
            );

        /**
         * VALIDAR CONFLICTO DEL DOCENTE
         */
        $teacherConflict =
            AcademyAssignmentSchedule::query()

                ->where(
                    'day_of_week',
                    $data['day_of_week']
                )

                ->whereHas(
                    'assignment',
                    function ($query) use ($assignment) {

                        $query->where(
                            'user_id',
                            $assignment->user_id
                        );
                    }
                )

                ->where(
                    'start_time',
                    '<',
                    $data['end_time']
                )

                ->where(
                    'end_time',
                    '>',
                    $data['start_time']
                )

                ->exists();

        if ($teacherConflict) {

            return response()->json([

                'success' => false,

                'message' =>
                    'El docente ya tiene una clase asignada en ese horario.',

            ], 422);
        }

        /**
         * VALIDAR CONFLICTO DEL GRUPO
         */
        $classroomConflict =
            AcademyAssignmentSchedule::query()

                ->where(
                    'day_of_week',
                    $data['day_of_week']
                )

                ->whereHas(
                    'assignment',
                    function ($query) use ($assignment) {

                        $query->where(
                            'classroom_id',
                            $assignment->classroom_id
                        );
                    }
                )

                ->where(
                    'start_time',
                    '<',
                    $data['end_time']
                )

                ->where(
                    'end_time',
                    '>',
                    $data['start_time']
                )

                ->exists();

        if ($classroomConflict) {

            return response()->json([

                'success' => false,

                'message' =>
                    'El grupo ya tiene una clase asignada en ese horario.',

            ], 422);
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
     * Actualizar horario
     */
    public function update(
        Request $request,
        AcademyAssignmentSchedule $academyAssignmentSchedule
    )
    {
        $data = $request->validate([

            'day_of_week' => [
                'sometimes',
                'integer',
                'between:1,7',
            ],

            'start_time' => [
                'sometimes',
                'date_format:H:i',
            ],

            'end_time' => [
                'sometimes',
                'date_format:H:i',
            ],
        ]);

        $dayOfWeek =
            $data['day_of_week']
            ?? $academyAssignmentSchedule->day_of_week;

        $startTime =
            $data['start_time']
            ?? $academyAssignmentSchedule->start_time;

        $endTime =
            $data['end_time']
            ?? $academyAssignmentSchedule->end_time;

        /**
         * Validar rango horario
         */
        if ($startTime >= $endTime) {

            return response()->json([

                'success' => false,

                'message' =>
                    'La hora de fin debe ser mayor que la hora de inicio.',

            ], 422);
        }

        $assignment =
            AcademyAssignment::findOrFail(
                $academyAssignmentSchedule
                    ->academy_assignment_id
            );

        /**
         * CONFLICTO DEL DOCENTE
         */
        $teacherConflict =
            AcademyAssignmentSchedule::query()

                ->where(
                    'id',
                    '!=',
                    $academyAssignmentSchedule->id
                )

                ->where(
                    'day_of_week',
                    $dayOfWeek
                )

                ->whereHas(
                    'assignment',
                    function ($query) use (
                        $assignment
                    ) {

                        $query->where(
                            'user_id',
                            $assignment->user_id
                        );
                    }
                )

                ->where(
                    'start_time',
                    '<',
                    $endTime
                )

                ->where(
                    'end_time',
                    '>',
                    $startTime
                )

                ->exists();

        if ($teacherConflict) {

            return response()->json([

                'success' => false,

                'message' =>
                    'El docente ya tiene una clase asignada en ese horario.',

            ], 422);
        }

        /**
         * CONFLICTO DEL GRUPO
         */
        $classroomConflict =
            AcademyAssignmentSchedule::query()

                ->where(
                    'id',
                    '!=',
                    $academyAssignmentSchedule->id
                )

                ->where(
                    'day_of_week',
                    $dayOfWeek
                )

                ->whereHas(
                    'assignment',
                    function ($query) use (
                        $assignment
                    ) {

                        $query->where(
                            'classroom_id',
                            $assignment->classroom_id
                        );
                    }
                )

                ->where(
                    'start_time',
                    '<',
                    $endTime
                )

                ->where(
                    'end_time',
                    '>',
                    $startTime
                )

                ->exists();

        if ($classroomConflict) {

            return response()->json([

                'success' => false,

                'message' =>
                    'El grupo ya tiene una clase asignada en ese horario.',

            ], 422);
        }

        $academyAssignmentSchedule->update(
            $data
        );

        return response()->json([

            'success' => true,

            'data' =>
                $academyAssignmentSchedule
                    ->fresh(),
        ]);
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