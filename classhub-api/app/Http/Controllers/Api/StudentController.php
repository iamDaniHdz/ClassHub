<?php

namespace App\Http\Controllers\Api;

use App\Events\StudentCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\BulkStudentRequest;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\StudentAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Listar estudiantes
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = StudentAssignment::with('student', 'assignment');

        // multi-tenant
        if (!$user->isAdmin()) {
            $schoolIds = $user->schools()->pluck('schools.id');

            $query->whereHas('assignment.classroom', function ($q) use ($schoolIds) {
                $q->whereIn('school_id', $schoolIds);
            });
        }

        // filtrar por classroom + user
        if ($request->classroom_id) {
            $query->whereHas('assignment', function ($q) use ($request, $user) {

                $q->where('classroom_id', $request->classroom_id);

                if (!$user->isAdmin()) {
                    $q->where('user_id', $user->id);
                }

            });
        }

        // búsqueda
        if ($request->search) {
            $search = $request->search;

            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                ->orWhere('paternal_surname', 'like', "%$search%")
                ->orWhere('maternal_surname', 'like', "%$search%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()->map(function ($sa) {

                return [
                    'id' => $sa->id,
                    'student' => [
                        'id' => $sa->student->id,
                        'name' => $sa->student->name,
                        'paternal_surname' => $sa->student->paternal_surname,
                        'maternal_surname' => $sa->student->maternal_surname,
                    ]
                ];
            })
        ]);
    }

    /**
     * Crear estudiante individual
     */
    public function store(StoreStudentRequest $request)
    {
        $user = $request->user();

        $classroom = Classroom::findOrFail(
            $request->classroom_id
        );

        $this->authorizeClassroom(
            $user,
            $classroom
        );

        $student = Student::create([
            ...$request->validated(),
            'school_id' => $classroom->school_id,
        ]);

        event(
            new StudentCreated($student)
        );

        return response()->json([
            'success' => true,
            'data' => new StudentResource($student),
        ], 201);
    }

    /**
     * BULK INSERT (CREACIÓN MASIVA)
     */
    public function bulk(BulkStudentRequest $request)
    {
        $user = $request->user();

        $studentsData = $request->validated();

        $firstClassroom = Classroom::findOrFail($studentsData[0]['classroom_id']);

        $this->authorizeClassroom($user, $firstClassroom);

        $created = 0;

        DB::transaction(function () use ($studentsData, $firstClassroom, &$created) {

            foreach ($studentsData as $data) {

                if ($data['classroom_id'] !== $firstClassroom->id) {
                    abort(422, 'All students must belong to the same classroom');
                }

                // evitar duplicados
                $exists = Student::where([
                    'name' => $data['name'],
                    'paternal_surname' => $data['paternal_surname'],
                    'maternal_surname' => $data['maternal_surname'],
                    'classroom_id' => $firstClassroom->id,
                ])->exists();

                if ($exists) {
                    continue;
                }

                $student = Student::create([
                    'name' => $data['name'],
                    'paternal_surname' => $data['paternal_surname'],
                    'maternal_surname' => $data['maternal_surname'],
                    'classroom_id' => $data['classroom_id'],
                    'school_id' => $firstClassroom->school_id,
                ]);

                event(new StudentCreated($student));

                $created++;
            }

        });

        return response()->json([
            'success' => true,
            'message' => 'Students created successfully',
            'created' => $created,
        ]);
    }

    /**
     * Mostrar estudiante
     */
    public function show(Request $request, Student $student)
    {
        $this->authorizeStudent($request->user(), $student);

        return response()->json([
            'success' => true,
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Actualizar estudiante
     */
    public function update(
        UpdateStudentRequest $request,
        Student $student
    ) {
        $user = $request->user();

        $this->authorizeStudent(
            $user,
            $student
        );

        $data = $request->validated();

        $oldClassroomId = $student->classroom_id;

        if (isset($data['classroom_id'])) {

            $classroom = Classroom::findOrFail(
                $data['classroom_id']
            );

            $this->authorizeClassroom(
                $user,
                $classroom
            );

            $data['school_id'] =
                $classroom->school_id;
        }

        $student->update($data);

        /**
         * Si cambió de salón
         * resincronizar asignaciones
         */
        if (
            isset($data['classroom_id']) &&
            $oldClassroomId !== $student->classroom_id
        ) {

            StudentAssignment::where(
                'student_id',
                $student->id
            )->delete();

            event(
                new StudentCreated(
                    $student->fresh()
                )
            );
        }

        return response()->json([
            'success' => true,
            'data' => new StudentResource(
                $student->fresh()
            ),
        ]);
    }

    /**
     * Eliminar estudiante
     */
    public function destroy(
        Request $request,
        Student $student
    ) {
        $this->authorizeStudent(
            $request->user(),
            $student
        );

        $student->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Validar acceso al salón (multi-tenant)
     */
    private function authorizeClassroom($user, $classroom)
    {
        if ($user->isAdmin()) {
            return;
        }

        $schoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array($classroom->school_id, $schoolIds)) {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * Validar acceso al estudiante (multi-tenant)
     */
    private function authorizeStudent($user, Student $student)
    {
        if ($user->isAdmin()) {
            return;
        }

        $schoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array($student->school_id, $schoolIds)) {
            abort(403, 'Unauthorized');
        }
    }
}