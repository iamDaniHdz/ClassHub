<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademyAssignmentSchedule extends Model
{
    protected $fillable = [

        'academy_assignment_id',

        'day_of_week',

        'start_time',

        'end_time',
    ];

    public function assignment()
    {
        return $this->belongsTo(
            AcademyAssignment::class,
            'academy_assignment_id'
        );
    }
}