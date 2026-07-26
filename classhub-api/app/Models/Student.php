<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name',
        'second_name',
        'paternal_surname',
        'maternal_surname',
        'student_enrollment',
        'is_active',
        'classroom_id',
        'school_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'full_name',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function assignments()
    {
        return $this->hasMany(StudentAssignment::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim(
            implode(
                ' ',
                array_filter([
                    $this->name,
                    $this->second_name,
                    $this->paternal_surname,
                    $this->maternal_surname,
                ]),
            ),
        );
    }
}