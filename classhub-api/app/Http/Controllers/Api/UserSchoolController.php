<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\School;
use Illuminate\Http\Request;

class UserSchoolController extends Controller
{
    public function attachSchool(Request $request, User $user)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
        ]);

        $school = School::findOrFail($request->school_id);

        $user->schools()->syncWithoutDetaching([$school->id]);

        return response()->json([
            'success' => true,
            'message' => 'School attached to user successfully'
        ]);
    }
}