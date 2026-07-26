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
}