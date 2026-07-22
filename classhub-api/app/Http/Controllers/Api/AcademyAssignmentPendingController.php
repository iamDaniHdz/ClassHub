<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademyAssignment;
use App\Models\AcademyAssignmentPending;
use Illuminate\Http\Request;

class AcademyAssignmentPendingController extends Controller
{
    /**
     * Crear pendiente
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'academy_assignment_id' => [
                'required',
                'exists:academy_assignments,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $assignment = AcademyAssignment::findOrFail(
            $data['academy_assignment_id']
        );

        if (
            $assignment->user_id !==
            $request->user()->id
        ) {
            abort(403, 'Not allowed');
        }

        $pending =
            AcademyAssignmentPending::create([
                'academy_assignment_id' =>
                    $data['academy_assignment_id'],

                'created_by' =>
                    $request->user()->id,

                'title' =>
                    $data['title'],

                'description' =>
                    $data['description'] ?? null,

                'is_completed' => false,
            ]);

        return response()->json([
            'success' => true,
            'data' => $pending,
        ], 201);
    }

    /**
     * Actualizar pendiente
     */
    public function update(
        Request $request,
        AcademyAssignmentPending $academyAssignmentPending
    ) {
        if (
            $academyAssignmentPending->created_by !==
            $request->user()->id
        ) {
            abort(403, 'Not allowed');
        }

        $data = $request->validate([
            'title' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'is_completed' => [
                'sometimes',
                'boolean',
            ],
        ]);

        $academyAssignmentPending->update(
            $data
        );

        return response()->json([
            'success' => true,
            'data' => $academyAssignmentPending->fresh(),
        ]);
    }

    /**
     * Eliminar pendiente
     */
    public function destroy(
        Request $request,
        AcademyAssignmentPending $academyAssignmentPending
    ) {
        if (
            $academyAssignmentPending->created_by !==
            $request->user()->id
        ) {
            abort(403, 'Not allowed');
        }

        $academyAssignmentPending->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Mostrar pendiente
     */
    public function show(
        Request $request,
        AcademyAssignmentPending $academyAssignmentPending
    )
    {
        if (
            $academyAssignmentPending->created_by
            !==
            $request->user()->id
        ) {

            abort(
                403,
                'Not allowed'
            );
        }

        return response()->json([

            'success' => true,

            'data' =>
                $academyAssignmentPending,
        ]);
    }
}