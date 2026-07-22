<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role_id',
])]
#[Hidden([
    'password',
    'remember_token'
])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Relación con Role
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Casts de atributos
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación con School
     */
    public function schools()
    {
        return $this->belongsToMany(School::class);
    }

    // Helper :: Role
    public function isAdmin(): bool
    {
        return $this->role?->key === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role?->key === 'teacher';
    }


    public function assignments()
    {
        return $this->hasMany(AcademyAssignment::class);
    }

    public function teacherProfile()
    {
        return $this->hasOne(
            TeacherProfile::class
        );
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->teacherProfile?->full_name
            ?? $this->name;
    }

    public function academies()
    {
        return $this->belongsToMany(
            Academy::class,
            'academy_teacher'
        );
    }

    public function pendings()
    {
        return $this->hasMany(
            AcademyAssignmentPending::class,
            'created_by'
        );
    }
}