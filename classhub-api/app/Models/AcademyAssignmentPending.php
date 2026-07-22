<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademyAssignmentPending extends Model
{
    protected $fillable = [

        'academy_assignment_id',

        'created_by',

        'title',

        'description',

        'due_date',

        'is_completed',
    ];

    protected $casts = [

        'is_completed' => 'boolean',
    ];

    public function assignment()
    {
        return $this->belongsTo(
            AcademyAssignment::class,
            'academy_assignment_id'
        );
    }

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}