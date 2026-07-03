<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('paternal_surname');
            $table->string('maternal_surname');

            $table->foreignId('classroom_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('school_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'name',
                'paternal_surname',
                'maternal_surname',
                'classroom_id'],
                'students_unique_fullname_classroom'
            );

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
