<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Academy;
use App\Http\Requests\StoreAcademyRequest;
use App\Http\Requests\UpdateAcademyRequest;
use App\Http\Resources\AcademyResource;
use Illuminate\Http\Request;

class AcademyController extends Controller
{
    /**
     * List academies
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $selectedSchoolId =
            $request->input(
                'school_id'
            );

        // ADMIN → todas las academias
        $query = Academy::query();

        if (!$user->isAdmin()) {

            $schoolIds = $user
                ->schools()
                ->pluck('schools.id');

            $query->whereIn(
                'school_id',
                $schoolIds
            );
        }

        if ($request->school_id) {

            $query->where(
                'school_id',
                $request->school_id
            );
        }

        $academies = $query
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => AcademyResource::collection($academies),
        ]);
    }

    /**
     * Crear academia
     */
    public function store(StoreAcademyRequest $request)
    {
        $user = $request->user();

        $schoolId = $this->resolveSchoolId($request, $user);

        $academy = Academy::create([
            'name' => $request->name,
            'school_id' => $schoolId,
        ]);

        return response()->json([
            'success' => true,
            'data' => new AcademyResource($academy),
        ], 201);
    }

    /**
     * Mostrar academia
     */
    public function show(Request $request, Academy $academy)
    {
        $this->authorizeAccess($request->user(), $academy);

        return response()->json([
            'success' => true,
            'data' => new AcademyResource($academy),
        ]);
    }

    /**
     * Actualizar academia
     */
    public function update(UpdateAcademyRequest $request, Academy $academy)
    {
        $this->authorizeAccess($request->user(), $academy);

        $academy->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'data' => new AcademyResource($academy),
        ]);
    }

    /**
     * Eliminar academia
     */
    public function destroy(Request $request, Academy $academy)
    {
        $this->authorizeAccess($request->user(), $academy);

        $academy->delete();

        return response()->json([
            'success' => true,
            'message' => 'Academy deleted successfully',
        ]);
    }

    /**
     * Resolver school_id (multi-tenant safe)
     */
    private function resolveSchoolId(Request $request, $user)
    {
        // ADMIN → puede elegir
        if ($user->isAdmin()) {
            return $request->input('school_id');
        }

        // TEACHER → usar la primera escuela (MVP)
        return $user->schools()->first()->id;
    }

    /**
     * Validar acceso a recurso
     */
    private function authorizeAccess($user, Academy $academy)
    {
        if ($user->isAdmin()) {
            return true;
        }

        $userSchoolIds = $user->schools()->pluck('schools.id')->toArray();

        if (!in_array($academy->school_id, $userSchoolIds)) {
            abort(403, 'Unauthorized access to this academy');
        }

        return true;
    }
}