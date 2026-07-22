<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MySchoolController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([

            'success' => true,

            'data' => $request
                ->user()
                ->schools()
                ->orderBy('name')
                ->get(),
        ]);
    }
}