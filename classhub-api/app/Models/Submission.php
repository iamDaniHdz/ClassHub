<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'student_assignment_id',
        'title',
        'status',
        'score',
    ];
}