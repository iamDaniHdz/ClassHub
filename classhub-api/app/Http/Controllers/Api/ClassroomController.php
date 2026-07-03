<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Http\Resources\ClassroomResource;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Classroom::query()
            ->withCount('students');

        if ($user->isAdmin()) {
            $classrooms = $query->latest()->get();
        } else {

            $schoolIds = $user->schools()->pluck('schools.id');

            $classrooms = $query
                ->whereIn('school_id', $schoolIds)
                ->latest()
                ->get();
        }

        if ($request->boolean('with_students')) {
            $query->with('students');
        }

        return response()->json([
            'success' => true,
            'data' => ClassroomResource::collection($classrooms),
        ]);
    }

    public function store(StoreClassroomRequest $request)
    {
        $user = $request->user();

        $schoolId = $this->resolveSchoolId($request, $user);

        $this->validateDuplicate($request, $schoolId);

        $classroom = Classroom::create([
            'name' => $request->name,
            'degree' => $request->degree,
            'group' => $request->group,
            'school_id' => $schoolId,
        ]);

        return response()->json([
            'success' => true,
            'data' => new ClassroomResource($classroom),
        ], 201);
    }

    public function show(Request $request, Classroom $classroom)
    {
        $this->authorizeAccess($request->user(), $classroom);

        $classroom->loadCount('students');

        if ($request->boolean('with_students')) {
            $classroom->load('students');
        }

        return response()->json([
            'success' => true,
            'data' => new ClassroomResource($classroom),
        ]);
    }

    public function update(UpdateClassroomRequest $request, Classroom $classroom)
    {
        $this->authorizeAccess($request->user(), $classroom);

        $this->validateDuplicate($request, $classroom->school_id, $classroom->id);

        $classroom->update([
            'name' => $request->name,
            'degree' => $request->degree,
            'group' => $request->group,
        ]);

        return response()->json([
            'success' => true,
            'data' => new ClassroomResource($classroom),
        ]);
    }

    public function destroy(Request $request, Classroom $classroom)
    {
        $this->authorizeAccess($request->user(), $classroom);

        $classroom->delete();

        return response()->json([
            'success' => true
        ]);
    }

    /**
     * Resolver school_id
     */
    private function resolveSchoolId(Request $request, $user)
    {
        if ($user->isAdmin()) {
            return $request->input('school_id');
        }

        return $user->schools()->first()->id;
    }

    /**
     * Validar acceso multi-tenant
     */
    private function authorizeAccess($user, Classroom $classroom)
    {
        if ($user->isAdmin()) return true;

        $schoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array($classroom->school_id, $schoolIds)) {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * Validar duplicados
     */
    private function validateDuplicate($request, $schoolId, $ignoreId = null)
    {
        $query = Classroom::where([
            'degree' => $request->degree,
            'group' => $request->group,
            'school_id' => $schoolId,
        ]);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            abort(422, 'Classroom already exists for this school');
        }
    }
}
