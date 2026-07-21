<?php

namespace App\Http\Controllers\Api;
use App\Models\Academy;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AcademyTeacherController extends Controller
{
    public function index(
        Academy $academy
    )
    {
        return response()->json([
            'success' => true,

            'data' => $academy
                ->teachers()
                ->with('teacherProfile')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([

            'academy_id' => [
                'required',
                'exists:academies,id'
            ],

            'user_id' => [
                'required',
                'exists:users,id'
            ],
        ]);

        $academy = Academy::findOrFail(
            $data['academy_id']
        );

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
}
