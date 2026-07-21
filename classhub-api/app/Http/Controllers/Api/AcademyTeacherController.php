<?php

namespace App\Http\Controllers\Api;
use App\Models\Academy;
use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;

class AcademyTeacherController extends Controller
{
    public function index(
        Request $request,
        Academy $academy
    )
    {
        $query = $academy
            ->teachers()
            ->with('teacherProfile');

        if ($request->filled('classroom_id')) {

            $classroom = Classroom::findOrFail(
                $request->classroom_id
            );

            $query->whereHas(
                'schools',
                function ($q) use ($classroom) {

                    $q->where(
                        'schools.id',
                        $classroom->school_id
                    );
                }
            );
        }

        return response()->json([
            'success' => true,

            'data' => $query
                ->get()
                ->map(function ($teacher) {

                    return [

                        'id' => $teacher->id,

                        'name' =>
                            $teacher->display_name,

                        'email' =>
                            $teacher->email,
                    ];
                }),
        ]);
    }

   public function store(Request $request)
    {
        $data = $request->validate([

            'academy_id' => [
                'required',
                'exists:academies,id',
            ],

            'user_id' => [
                'required',
                'exists:users,id',
            ],
        ]);

        $academy = Academy::findOrFail(
            $data['academy_id']
        );

        $teacher = User::findOrFail(
            $data['user_id']
        );

        $teacherSchoolIds = $teacher
            ->schools()
            ->pluck('schools.id')
            ->toArray();

        if (
            !in_array(
                $academy->school_id,
                $teacherSchoolIds
            )
        ) {
            abort(
                422,
                'Teacher does not belong to this school'
            );
        }

        $academy->teachers()->syncWithoutDetaching([
            $data['user_id']
        ]);

        return response()->json([
            'success' => true,
        ]);
    }

    public function destroy(
        Academy $academy,
        User $user
    )
    {
        $academy
            ->teachers()
            ->detach($user->id);

        return response()->json([
            'success' => true,
        ]);
    }

    public function availableTeachers(
        Academy $academy
    )
    {
        $teachers = User::query()

            ->whereHas(
                'role',
                fn ($q) =>
                    $q->where(
                        'key',
                        'teacher'
                    )
            )

            ->whereHas(
                'schools',
                function ($q) use ($academy) {

                    $q->where(
                        'schools.id',
                        $academy->school_id
                    );
                }
            )

            ->whereDoesntHave(
                'academies',
                function ($q) use ($academy) {

                    $q->where(
                        'academies.id',
                        $academy->id
                    );
                }
            )

            ->with('teacherProfile')

            ->get()

            ->map(function ($teacher) {

                return [

                    'id' => $teacher->id,

                    'name' => $teacher->display_name,

                    'email' => $teacher->email,
                ];
            });

        return response()->json([

            'success' => true,

            'data' => $teachers,
        ]);
    }
}
