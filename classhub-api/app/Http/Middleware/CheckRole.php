<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Seguridad: usuario no autenticado
        if (!$user) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        // Seguridad: usuario sin rol
        if (!$user->role) {
            return response()->json([
                'message' => 'Usuario sin rol asignado'
            ], 403);
        }

        // Validación por role.key
        if (!in_array($user->role->key, $roles)) {
            return response()->json([
                'message' => 'No autorizado'
            ], 403);
        }

        return $next($request);
    }
}