<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkStudentRequest;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Resources\StudentResource;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Listar estudiantes
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Student::query();

        // Filtro multi-tenant
        if (!$user->isAdmin()) {
            $schoolIds = $user->schools()->pluck('schools.id');

            $query->whereIn('school_id', $schoolIds);
        }

        // Filtrar por classroom
        if ($request->classroom_id) {
            $query->where('classroom_id', $request->classroom_id);
        }

        // Búsqueda (CLAVE)
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                ->orWhere('paternal_surname', 'LIKE', "%$search%")
                ->orWhere('maternal_surname', 'LIKE', "%$search%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => StudentResource::collection($query->get()),
        ]);
    }

    /**
     * Crear estudiante individual
     */
    public function store(StoreStudentRequest $request)
    {
        $user = $request->user();

        $classroom = Classroom::findOrFail($request->classroom_id);

        $this->authorizeClassroom($user, $classroom);

        $student = Student::create([
            ...$request->validated(),
            'school_id' => $classroom->school_id,
        ]);

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

        // Validar classroom base
        $firstClassroom = Classroom::findOrFail($studentsData[0]['classroom_id']);

        $this->authorizeClassroom($user, $firstClassroom);

        $insertData = [];

        foreach ($studentsData as $data) {

            if ($data['classroom_id'] !== $firstClassroom->id) {
                abort(422, 'All students must belong to the same classroom');
            }

            $insertData[] = [
                'name' => $data['name'],
                'paternal_surname' => $data['paternal_surname'],
                'maternal_surname' => $data['maternal_surname'],
                'classroom_id' => $data['classroom_id'],
                'school_id' => $firstClassroom->school_id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Student::insert($insertData);

        return response()->json([
            'success' => true,
            'message' => 'Students created successfully',
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
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $user = $request->user();

        $this->authorizeStudent($user, $student);

        $data = $request->validated();

        if (isset($data['classroom_id'])) {

            $classroom = Classroom::findOrFail($data['classroom_id']);

            $this->authorizeClassroom($user, $classroom);

            // mantener consistencia school ↔ classroom
            $data['school_id'] = $classroom->school_id;
        }

        $student->update($data);

        return response()->json([
            'success' => true,
            'data' => new StudentResource($student),
        ]);
    }

    /**
     * Eliminar estudiante
     */
    public function destroy(Request $request, Student $student)
    {
        $this->authorizeStudent($request->user(), $student);

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