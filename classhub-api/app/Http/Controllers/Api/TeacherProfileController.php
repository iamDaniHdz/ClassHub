<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Http\Request;

class TeacherProfileController extends Controller
{
    /**
     * Listado
     */
    public function index()
    {
        $profiles = TeacherProfile::with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $profiles,
        ]);
    }

    /**
     * Crear
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => [
                'required',
                'exists:users,id',
            ],

            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'paternal_surname' => [
                'required',
                'string',
                'max:255',
            ],

            'maternal_surname' => [
                'nullable',
                'string',
                'max:255',
            ],

            'employee_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'degree' => [
                'nullable',
                'string',
                'max:255',
            ],

            'career' => [
                'nullable',
                'string',
                'max:255',
            ],

            'specialty' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'photo' => [
                'nullable',
                'string',
            ],
        ]);

        $user = User::with('role')
            ->findOrFail($data['user_id']);

        if (!$user->isTeacher()) {
            abort(
                422,
                'User must have teacher role'
            );
        }

        if (
            TeacherProfile::where(
                'user_id',
                $user->id
            )->exists()
        ) {
            abort(
                422,
                'Teacher profile already exists'
            );
        }

        $profile = TeacherProfile::create(
            $data
        );

        return response()->json([
            'success' => true,
            'data' => $profile,
        ], 201);
    }

    /**
     * Mostrar
     */
    public function show(string $id)
    {
        $profile = TeacherProfile::with(
            'user'
        )->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * Actualizar
     */
    public function update(
        Request $request,
        string $id
    )
    {
        $profile = TeacherProfile::findOrFail(
            $id
        );

        $data = $request->validate([
            'first_name' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'paternal_surname' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'maternal_surname' => [
                'nullable',
                'string',
                'max:255',
            ],

            'employee_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'degree' => [
                'nullable',
                'string',
                'max:255',
            ],

            'career' => [
                'nullable',
                'string',
                'max:255',
            ],

            'specialty' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'photo' => [
                'nullable',
                'string',
            ],
        ]);

        $profile->update($data);

        return response()->json([
            'success' => true,
            'data' => $profile->fresh(),
        ]);
    }

    /**
     * Eliminar
     */
    public function destroy(string $id)
    {
        $profile = TeacherProfile::findOrFail(
            $id
        );

        $profile->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}