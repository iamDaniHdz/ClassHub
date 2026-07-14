<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Models\AcademyAssignment;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        $user->load([
            'role',
            'teacherProfile',
        ]);

        $academies = AcademyAssignment::query()
            ->with('academy')
            ->where('user_id', $user->id)
            ->get()
            ->groupBy('academy_id')
            ->map(function ($items) {

                $academy = $items->first()->academy;

                return [
                    'academy_id' => $academy->id,
                    'academy_name' => $academy->name,
                    'groups_count' => $items->count(),
                ];
            })
            ->values();

        $user->academies_summary = $academies;

        return response()->json([
            'success' => true,
            'data' => new ProfileResource($user),
        ]);
    }
}