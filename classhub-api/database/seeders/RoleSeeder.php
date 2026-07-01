<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['key' => 'admin'],
            ['name' => 'Administrador']
        );

        Role::updateOrCreate(
            ['key' => 'teacher'],
            ['name' => 'Docente']
        );
    }
}
