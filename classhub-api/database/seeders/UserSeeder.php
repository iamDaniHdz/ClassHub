<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario principal (para login)
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@classhub.com',
            'password' => '12345',
        ]);
    }
}
