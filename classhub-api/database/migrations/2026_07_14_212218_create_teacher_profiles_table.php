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
        Schema::create('teacher_profiles', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('first_name');

            $table->string('middle_name')
                ->nullable();

            $table->string('paternal_surname');

            $table->string('maternal_surname')
                ->nullable();

            $table->string('employee_number')
                ->nullable();

            $table->string('degree')
                ->nullable();

            $table->string('career')
                ->nullable();

            $table->string('specialty')
                ->nullable();

            $table->string('phone')
                ->nullable();

            $table->string('photo')
                ->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
