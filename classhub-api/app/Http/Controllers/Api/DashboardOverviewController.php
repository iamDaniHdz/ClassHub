<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Academy;
use App\Models\AcademyAssignment;
use App\Models\AcademyAssignmentSchedule;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\AcademyAssignmentPending;

class DashboardOverviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $schoolId = $request->input(
            'school_id'
        );

        if (!$schoolId) {

            return response()->json([
                'success' => false,
                'message' => 'school_id is required',
            ], 422);
        }

        /**
         * ADMIN DASHBOARD
         */
        if ($user->role?->key === 'admin') {

            return response()->json([

                'success' => true,

                'data' => [

                    'role' => 'admin',

                    'metrics' => [

                        'academies' => Academy::where(
                            'school_id',
                            $schoolId
                        )->count(),

                        'classrooms' => Classroom::where(
                            'school_id',
                            $schoolId
                        )->count(),

                        'students' => Student::where(
                            'school_id',
                            $schoolId
                        )->count(),

                        'teachers' => User::whereHas(
                            'role',
                            fn ($q) => $q->where(
                                'key',
                                'teacher'
                            )
                        )
                        ->whereHas(
                            'schools',
                            fn ($q) => $q->where(
                                'schools.id',
                                $schoolId
                            )
                        )
                        ->count(),

                        'academy_assignments' =>
                            AcademyAssignment::whereHas(
                                'classroom',
                                fn ($q) => $q->where(
                                    'school_id',
                                    $schoolId
                                )
                            )
                            ->count(),

                        'schedules' =>
                            AcademyAssignmentSchedule::whereHas(
                                'assignment.classroom',
                                fn ($q) => $q->where(
                                    'school_id',
                                    $schoolId
                                )
                            )
                            ->count(),
                    ],
                ],
            ]);
        }

        /**
         * TEACHER DASHBOARD
         */

        $pendingCount =
            AcademyAssignmentPending::where(
                'created_by',
                $user->id
            )
            ->whereHas(
                'assignment.classroom',
                fn ($q) =>
                    $q->where(
                        'school_id',
                        $schoolId
                    )
            )
            ->where(
                'is_completed',
                false
            )
            ->count();
        
        $overdueCount =
            AcademyAssignmentPending::where(
                'created_by',
                $user->id
            )
            ->where(
                'is_completed',
                false
            )
            ->whereDate(
                'due_date',
                '<',
                now()
            )
            ->whereHas(
                'assignment.classroom',
                fn ($q) =>
                    $q->where(
                        'school_id',
                        $schoolId
                    )
            )
            ->count();
        
        $upcomingPendings =
            AcademyAssignmentPending::with([
                'assignment.academy',
                'assignment.classroom',
            ])
            ->where(
                'created_by',
                $user->id
            )
            ->where(
                'is_completed',
                false
            )
            ->whereNotNull(
                'due_date'
            )
            ->whereHas(
                'assignment.classroom',
                fn ($q) =>
                    $q->where(
                        'school_id',
                        $schoolId
                    )
            )
            ->orderBy(
                'due_date'
            )
            ->limit(5)
            ->get();

        $today =
            now()->dayOfWeek;

        if ($today === 0) {
            $today = 7;
        }

        $academyAssignments =
            AcademyAssignment::where(
                'user_id',
                $user->id
            )
            ->whereHas(
                'classroom',
                fn ($q) => $q->where(
                    'school_id',
                    $schoolId
                )
            );

        $academyCount =
            (clone $academyAssignments)
                ->count();

        $todayClasses =
            AcademyAssignmentSchedule::where(
                'day_of_week',
                $today
            )
            ->whereHas(
                'assignment',
                function ($q) use (
                    $user,
                    $schoolId
                ) {

                    $q->where(
                        'user_id',
                        $user->id
                    )
                    ->whereHas(
                        'classroom',
                        fn ($cq) => $cq->where(
                            'school_id',
                            $schoolId
                        )
                    );
                }
            )
            ->count();

        $weeklyClasses =
            AcademyAssignmentSchedule::whereHas(
                'assignment',
                function ($q) use (
                    $user,
                    $schoolId
                ) {

                    $q->where(
                        'user_id',
                        $user->id
                    )
                    ->whereHas(
                        'classroom',
                        fn ($cq) => $cq->where(
                            'school_id',
                            $schoolId
                        )
                    );
                }
            )
            ->count();

        $nextClass =
            AcademyAssignmentSchedule::with([
                'assignment.academy',
                'assignment.classroom',
            ])
            ->whereHas(
                'assignment',
                function ($q) use (
                    $user,
                    $schoolId
                ) {

                    $q->where(
                        'user_id',
                        $user->id
                    )
                    ->whereHas(
                        'classroom',
                        fn ($cq) => $cq->where(
                            'school_id',
                            $schoolId
                        )
                    );
                }
            )
            ->orderBy(
                'day_of_week'
            )
            ->orderBy(
                'start_time'
            )
            ->first();

        return response()->json([

            'success' => true,

            'data' => [

                'role' => 'teacher',

                'metrics' => [

                    'academies' =>
                        $academyCount,

                    'today_classes' =>
                        $todayClasses,

                    'weekly_classes' =>
                        $weeklyClasses,

                    'pendings' =>
                        $pendingCount,

                    'overdue_pendings' =>
                        $overdueCount,
                ],

                'next_class' => $nextClass
                    ? [

                        'academy' =>
                            $nextClass
                                ->assignment
                                ->academy
                                ->name,

                        'classroom' =>
                            $nextClass
                                ->assignment
                                ->classroom
                                ->degree .
                            '° ' .
                            $nextClass
                                ->assignment
                                ->classroom
                                ->group,

                        'day_of_week' =>
                            $nextClass
                                ->day_of_week,

                        'start_time' =>
                            $nextClass
                                ->start_time,

                        'end_time' =>
                            $nextClass
                                ->end_time,
                    ]
                    : null,

                'upcoming_pendings' =>
                    $upcomingPendings,

            ],
        ]);
    }
}