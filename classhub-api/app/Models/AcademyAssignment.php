<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademyAssignment extends Model
{
    protected $fillable = [
        'academy_id',
        'classroom_id',
        'user_id',
    ];

    public function academy()
    {
        return $this->belongsTo(Academy::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function studentAssignments()
    {
        return $this->hasMany(StudentAssignment::class);
    }
}