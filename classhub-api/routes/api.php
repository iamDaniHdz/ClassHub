<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/me', [AuthController::class, 'me']);

        //  SOLO ADMIN
        Route::middleware('role:admin')->group(function () {
            Route::get('/admin-test', fn () => response()->json([
                'message' => 'Acceso admin autorizado'
            ]));
        });

        // SOLO MAESTRO
        Route::middleware('role:teacher')->group(function () {
            Route::get('/teacher-test', fn () => response()->json([
                'message' => 'Acceso maestro autorizado'
            ]));
        });

    });

});
