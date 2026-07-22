<?php

use App\Http\Controllers\Api\AcademyAssignmentController;
use App\Http\Controllers\Api\AcademyAssignmentScheduleController;
use App\Http\Controllers\Api\AcademyController;
use App\Http\Controllers\Api\AcademyTeacherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\DashboardOverviewController;
use App\Http\Controllers\Api\MyScheduleController;
use App\Http\Controllers\Api\MySchoolController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentAssignmentController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TeacherProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserSchoolController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AcademyAssignmentPendingController;
use App\Http\Controllers\Api\MyPendingsController;

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
            Route::get('students/catalog',[StudentController::class, 'catalog']);
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
            Route::get('/my-academies-cards',[AcademyAssignmentController::class, 'myAcademiesCards']);

            Route::get(
                'academies/{academy}/teachers',
                [AcademyTeacherController::class, 'index']
            );

            Route::post(
                'academy-teachers',
                [AcademyTeacherController::class, 'store']
            );

            Route::delete(
                'academies/{academy}/teachers/{user}',
                [AcademyTeacherController::class, 'destroy']
            );

            Route::get(
                'teachers',
                [TeacherController::class, 'index']
            );
            
            Route::apiResource(
                'teacher-profiles',
                TeacherProfileController::class
            );

            Route::get(
                'classrooms/{classroom}/academy-assignments',
                [AcademyAssignmentController::class, 'byClassroom']
            );

            Route::get(
                'academies/{academy}/available-teachers',
                [
                    AcademyTeacherController::class,
                    'availableTeachers'
                ]
            );

            Route::apiResource(
                'users',
                UserController::class
            );

            Route::get(
                'users/{user}/teacher-profile',
                [
                    TeacherProfileController::class,
                    'profileByUser'
                ]
            );

            Route::get(
                'roles',
                [RoleController::class, 'index']
            );


            Route::get(
                '/me/profile',
                [ProfileController::class, 'me']
            );

            Route::get(
                'my-schools',
                [MySchoolController::class, 'index']
            );

            //Horarios

            Route::get(
                'academy-assignments/{academyAssignment}/schedules',
                [
                    AcademyAssignmentScheduleController::class,
                    'index'
                ]
            );

            Route::post(
                'academy-assignment-schedules',
                [
                    AcademyAssignmentScheduleController::class,
                    'store'
                ]
            );

            Route::delete(
                'academy-assignment-schedules/{academyAssignmentSchedule}',
                [
                    AcademyAssignmentScheduleController::class,
                    'destroy'
                ]
            );

            Route::get(
                'my-schedule',
                [MyScheduleController::class, 'index']
            );

            // DASHBOARD

            Route::get(
                'dashboard-overview',
                [DashboardOverviewController::class, 'index']
            );

            // PENDIENTES

            Route::get(
                'my-pendings',
                [MyPendingsController::class, 'index']
            );

            Route::post(
                'academy-assignment-pendings',
                [AcademyAssignmentPendingController::class, 'store']
            );

            Route::put(
                'academy-assignment-pendings/{academyAssignmentPending}',
                [AcademyAssignmentPendingController::class, 'update']
            );

            Route::delete(
                'academy-assignment-pendings/{academyAssignmentPending}',
                [AcademyAssignmentPendingController::class, 'destroy']
            );

        });


        Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
            Route::post('/users/{user}/schools', [UserSchoolController::class, 'attachSchool']);
        });

        
    });
});