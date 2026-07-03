<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;
use App\Models\Role;

class AuthController extends Controller
{
    /**
     * Registro de usuario
     */
    
    public function register(RegisterRequest $request)
    {
        $role = Role::where('key', $request->role)->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $role->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $user->load('role'),
        ]);
    }


    /**
     * Login
     */
    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (!$user || !password_verify($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
            ]
        ]);
    }

    /**
     * Usuario autenticado
     */
    public function me()
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource(auth()->user())
        ]);
    }
}