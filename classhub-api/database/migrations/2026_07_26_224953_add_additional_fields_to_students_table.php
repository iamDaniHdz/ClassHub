<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'students',
            function (Blueprint $table) {

                $table->string(
                    'second_name'
                )
                ->nullable()
                ->after('name');

                $table->string(
                    'student_enrollment'
                )
                ->nullable()
                ->after('maternal_surname');

                $table->boolean(
                    'is_active'
                )
                ->default(true)
                ->after('student_enrollment');

                $table->unique([
                    'school_id',
                    'student_enrollment',
                ]);
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'students',
            function (Blueprint $table) {

                $table->dropUnique(
                    'students_school_id_student_enrollment_unique'
                );

                $table->dropColumn([
                    'second_name',
                    'student_enrollment',
                    'is_active',
                ]);
            }
        );
    }
};