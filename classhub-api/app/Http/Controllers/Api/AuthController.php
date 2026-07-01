<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    /**
     * Registro de usuario
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create($request->validated());

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario',
            ], 500);
        }
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