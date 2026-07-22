<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json([

            'success' => true,

            'data' => Role::query()

                ->select([
                    'id',
                    'name',
                    'key',
                ])

                ->orderBy('id')
                ->get(),
        ]);
    }
}