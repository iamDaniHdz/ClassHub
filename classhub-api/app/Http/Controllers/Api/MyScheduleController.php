<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademyAssignmentSchedule;
use Illuminate\Http\Request;

class MyScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query =
            AcademyAssignmentSchedule::query()

                ->with([
                    'assignment.academy',
                    'assignment.classroom',
                ])

                ->whereHas(
                    'assignment',
                    function ($q) use ($user) {

                        $q->where(
                            'user_id',
                            $user->id
                        );
                    }
                );

        if ($request->school_id) {

            $query->whereHas(
                'assignment.classroom',
                function ($q) use ($request) {

                    $q->where(
                        'school_id',
                        $request->school_id
                    );
                }
            );
        }

        $schedules = $query

            ->orderBy('day_of_week')

            ->orderBy('start_time')

            ->get()

            ->map(function ($schedule) {

                return [

                    'schedule_id' =>
                        $schedule->id,

                    'day_of_week' =>
                        $schedule->day_of_week,

                    'start_time' =>
                        $schedule->start_time,

                    'end_time' =>
                        $schedule->end_time,

                    'academy' => [

                        'id' =>
                            $schedule
                                ->assignment
                                ->academy
                                ->id,

                        'name' =>
                            $schedule
                                ->assignment
                                ->academy
                                ->name,
                    ],

                    'classroom' => [

                        'id' =>
                            $schedule
                                ->assignment
                                ->classroom
                                ->id,

                        'name' =>
                            $schedule
                                ->assignment
                                ->classroom
                                ->degree .
                            '° ' .
                            $schedule
                                ->assignment
                                ->classroom
                                ->group,
                    ],
                ];
            });

        return response()->json([

            'success' => true,

            'data' => $schedules,
        ]);
    }
}