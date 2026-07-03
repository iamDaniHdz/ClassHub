<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::latest()->get();

        return response()->json([
            'success' => true,
            'data' => SchoolResource::collection($schools),
        ]);
    }

    public function store(StoreSchoolRequest $request)
    {
        $school = School::create($request->validated());

        return response()->json([
            'success' => true,
            'data' => new SchoolResource($school),
        ], 201);
    }

    public function show(School $school)
    {
        return response()->json([
            'success' => true,
            'data' => new SchoolResource($school),
        ]);
    }

    public function update(UpdateSchoolRequest $request, School $school)
    {
        $school->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => new SchoolResource($school),
        ]);
    }

    public function destroy(School $school)
    {
        $school->delete();

        return response()->json([
            'success' => true,
            'message' => 'School deleted successfully',
        ]);
    }
}