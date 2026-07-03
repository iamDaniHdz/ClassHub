<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Academy;
use App\Models\Classroom;
use App\Models\User;
use App\Models\AcademyAssignment;
use App\Http\Requests\StoreAcademyAssignmentRequest;
use App\Http\Resources\AcademyAssignmentResource;
use Illuminate\Http\Request;

class AcademyAssignmentController extends Controller
{
    /**
     * Listar asignaciones
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = AcademyAssignment::with([
            'academy',
            'classroom',
            'teacher',
        ]);

        if (!$user->isAdmin()) {
            $schoolIds = $user->schools()->pluck('schools.id');

            $query->whereHas('classroom', function ($q) use ($schoolIds) {
                $q->whereIn('school_id', $schoolIds);
            });
        }

        return response()->json([
            'success' => true,
            'data' => AcademyAssignmentResource::collection($query->get()),
        ]);
    }

    /**
     * Crear asignación (CORE)
     */
    public function store(StoreAcademyAssignmentRequest $request)
    {
        $user = $request->user();

        $academy = Academy::findOrFail($request->academy_id);
        $classroom = Classroom::findOrFail($request->classroom_id);
        $teacher = User::findOrFail($request->user_id);

        // 1. Validar misma escuela
        if ($academy->school_id !== $classroom->school_id) {
            abort(422, 'Academy and classroom must belong to the same school');
        }

        // 2. Validar teacher pertenece a la escuela
        $teacherSchoolIds = $teacher->schools()->pluck('schools.id')->toArray();

        if (!in_array($classroom->school_id, $teacherSchoolIds)) {
            abort(422, 'Teacher does not belong to this school');
        }

        // 3. Validar acceso multi-tenant
        $this->authorizeSchoolAccess($user, $classroom->school_id);

        // 4. Validar duplicado
        $exists = AcademyAssignment::where([
            'academy_id' => $academy->id,
            'classroom_id' => $classroom->id,
        ])->exists();

        if ($exists) {
            abort(422, 'Assignment already exists');
        }

        $assignment = AcademyAssignment::create([
            'academy_id' => $academy->id,
            'classroom_id' => $classroom->id,
            'user_id' => $teacher->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => new AcademyAssignmentResource(
                $assignment->load(['academy', 'classroom', 'teacher'])
            ),
        ], 201);
    }

    /**
     * Mostrar asignación
     */
    public function show(Request $request, AcademyAssignment $academyAssignment)
    {
        $user = $request->user();

        // validar acceso multi-tenant
        $this->authorizeSchoolAccess(
            $user,
            $academyAssignment->classroom->school_id
        );

        // siempre traer relaciones base
        $academyAssignment->load([
            'academy',
            'classroom',
        ]);

        // traer conteo de estudiantes
        $academyAssignment->classroom->loadCount('students');

        // opcional: traer estudiantes
        if ($request->boolean('with_students')) {
            $academyAssignment->classroom->load('students');
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $academyAssignment->id,

                'academy' => [
                    'id' => $academyAssignment->academy->id,
                    'name' => $academyAssignment->academy->name,
                ],

                'classroom' => [
                    'id' => $academyAssignment->classroom->id,
                    'name' => $academyAssignment->classroom->name,
                    'degree' => $academyAssignment->classroom->degree,
                    'group' => $academyAssignment->classroom->group,
                ],

                'students_count' => $academyAssignment->classroom->students_count ?? 0,

                'students' => $academyAssignment->classroom->relationLoaded('students')
                    ? $academyAssignment->classroom->students->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'name' => $student->name,
                            'paternal_surname' => $student->paternal_surname,
                            'maternal_surname' => $student->maternal_surname,
                        ];
                    })
                    : [],
            ]
        ]);
    }

    /**
     * Eliminar asignación
     */
    public function destroy(Request $request, AcademyAssignment $academyAssignment)
    {
        $this->authorizeSchoolAccess(
            $request->user(),
            $academyAssignment->classroom->school_id
        );

        $academyAssignment->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Validación multi-tenant
     */
    private function authorizeSchoolAccess($user, $schoolId)
    {
        if ($user->isAdmin()) {
            return true;
        }

        $schoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array($schoolId, $schoolIds)) {
            abort(403, 'Unauthorized');
        }
    }

    public function myAcademies(Request $request)
    {
        $user = $request->user();

        $query = AcademyAssignment::query()
            ->with([
                'academy',
                'classroom',
            ]);

        // SIEMPRE filtrar por usuario actual
        $query->where('user_id', $user->id);

        // multi-tenant extra protección
        if (!$user->isAdmin()) {
            $schoolIds = $user->schools()->pluck('schools.id');

            $query->whereHas('classroom', function ($q) use ($schoolIds) {
                $q->whereIn('school_id', $schoolIds);
            });
        }

        $assignments = $query->get();

        /**
         * AGRUPAR POR CLASSROOM
         */
        $grouped = $assignments->groupBy('classroom_id')->map(function ($items) use ($request) {

            $classroom = $items->first()->classroom;

            // cargar conteo
            $classroom->loadCount('students');

            // opcional: students
            if ($request->boolean('with_students')) {
                $classroom->load('students');
            }

            return [
                'classroom' => [
                    'id' => $classroom->id,
                    'name' => $classroom->name,
                    'degree' => $classroom->degree,
                    'group' => $classroom->group,
                ],

                'students_count' => $classroom->students_count ?? 0,

                'students' => $classroom->relationLoaded('students')
                    ? $classroom->students->map(fn ($student) => [
                        'id' => $student->id,
                        'name' => $student->name,
                        'paternal_surname' => $student->paternal_surname,
                        'maternal_surname' => $student->maternal_surname,
                    ])
                    : [],

                'academies' => $items->map(function ($assignment) {
                    return [
                        'id' => $assignment->academy->id,
                        'name' => $assignment->academy->name,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $grouped,
        ]);
    }
}