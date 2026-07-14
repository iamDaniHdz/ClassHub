<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'paternal_surname',
        'maternal_surname',
        'employee_number',
        'degree',
        'career',
        'specialty',
        'phone',
        'photo',
    ];
    
    protected $appends = [
        'full_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute()
    {
        return trim(
            implode(' ', [
                $this->first_name,
                $this->middle_name,
                $this->paternal_surname,
                $this->maternal_surname,
            ])
        );
    }
}