<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademyAssignmentPending;
use Illuminate\Http\Request;

class MyPendingsController extends Controller
{
    /**
     * Listar mis pendientes
     */
    public function index(Request $request)
    {
        $schoolId = $request->input('school_id');

        $query = AcademyAssignmentPending::query()
            ->with([
                'assignment.academy',
                'assignment.classroom',
            ])
            ->where(
                'created_by',
                $request->user()->id
            );

        if ($schoolId) {

            $query->whereHas(
                'assignment.classroom',
                function ($q) use ($schoolId) {

                    $q->where(
                        'school_id',
                        $schoolId
                    );
                }
            );
        }

        $pendings = $query
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pendings,
        ]);
    }
}