<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()

            ->with([
                'role',
                'schools',
            ]);

        if ($request->role_id) {

            $query->where(
                'role_id',
                $request->role_id
            );
        }

        $users = $query
            ->latest()
            ->get();

        return response()->json([

            'success' => true,

            'data' => UserResource::collection(
                $users
            ),
        ]);
    }

    public function store(
        StoreUserRequest $request
    ) {

        $user = User::create([

            'name' =>
                $request->name,

            'email' =>
                $request->email,

            'password' =>
                $request->password,

            'role_id' =>
                $request->role_id,
        ]);

        return response()->json([

            'success' => true,

            'data' =>
                new UserResource(
                    $user->load([
                        'role',
                        'schools',
                    ])
                ),
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json([

            'success' => true,

            'data' =>
                new UserResource(
                    $user->load([
                        'role',
                        'schools',
                    ])
                ),
        ]);
    }

    public function update(
        UpdateUserRequest $request,
        User $user
    ) {

        $data = [

            'name' =>
                $request->name,

            'email' =>
                $request->email,

            'role_id' =>
                $request->role_id,
        ];

        if ($request->filled('password')) {

            $data['password'] =
                $request->password;
        }

        $user->update($data);

        return response()->json([

            'success' => true,

            'data' =>
                new UserResource(
                    $user->load([
                        'role',
                        'schools',
                    ])
                ),
        ]);
    }

    public function destroy(
        User $user
    ) {

        $user->delete();

        return response()->json([

            'success' => true,
        ]);
    }
}