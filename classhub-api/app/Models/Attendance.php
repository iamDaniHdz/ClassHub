<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_assignment_id',
        'date',
        'status',
    ];

    public function studentAssignment()
    {
        return $this->belongsTo(StudentAssignment::class);
    }
}