<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()

            ->whereHas('role', function ($query) {

                $query->where(
                    'key',
                    'teacher'
                );

            })

            ->with('teacherProfile');

        if ($request->school_id) {

            $query->whereHas(
                'schools',
                function ($q) use ($request) {

                    $q->where(
                        'schools.id',
                        $request->school_id
                    );
                }
            );
        }

        $teachers = $query
            ->get()
            ->map(function ($user) {

                return [

                    'id' => $user->id,

                    'name' => $user->display_name,

                    'email' => $user->email,
                ];
            });

        return response()->json([

            'success' => true,

            'data' => $teachers,
        ]);
    }
}