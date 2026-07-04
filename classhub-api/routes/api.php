<?php

use App\Http\Controllers\Api\AcademyAssignmentController;
use App\Http\Controllers\Api\AcademyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentAssignmentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\UserSchoolController;

Route::prefix('v1')->group(function () {

    // AUTH
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // PROTECTED ROUTES
    Route::middleware('auth:sanctum')->group(function () {

        // USER
        Route::get('/me', [AuthController::class, 'me']);

        /**
         * TEST ROUTES
         */
        Route::middleware('role:admin')->get('/admin-test', fn () =>
            response()->json(['message' => 'Acceso admin autorizado'])
        );

        Route::middleware('role:teacher')->get('/teacher-test', fn () =>
            response()->json(['message' => 'Acceso maestro autorizado'])
        );

        /**
         * SCHOOLS (solo admin)
         */
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('schools', SchoolController::class);
        });

        /**
         * ACADEMIES
         */
        Route::middleware('role:admin,teacher')->group(function () {
            Route::apiResource('academies', AcademyController::class);
        });

        /**
         * ADMIN y DOCENTES
         */
        Route::middleware(['auth:sanctum', 'role:admin,teacher'])->group(function () {
            Route::apiResource('classrooms', ClassroomController::class);
            Route::apiResource('students', StudentController::class);
            Route::post('students/bulk', [StudentController::class, 'bulk']);
            Route::apiResource('academy*assignments', AcademyAssignmentController::class);
            Route::get('/my-academies', [AcademyAssignmentController::class, 'myAcademies']);
            Route::get('/my-academies-list', [AcademyAssignmentController::class, 'myAcademiesList']);
            Route::get('/academy-classrooms', [AcademyAssignmentController::class, 'classroomListByAcademy']);
            Route::apiResource('academy-assignments', AcademyAssignmentController::class);
            Route::get('/student-assignments/{id}', [StudentAssignmentController::class, 'show']);
            Route::post('/student-assignments', [StudentAssignmentController::class, 'store']);
            Route::post('/academy-assignments/{id}/sync-students', [AcademyAssignmentController::class, 'syncStudents']);
        });


        Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
            Route::post('/users/{user}/schools', [UserSchoolController::class, 'attachSchool']);
        });

        
    });
});