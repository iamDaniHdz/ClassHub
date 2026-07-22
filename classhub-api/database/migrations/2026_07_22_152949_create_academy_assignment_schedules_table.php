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
        Schema::create(
            'academy_assignment_schedules',
            function (Blueprint $table) {

                $table->id();

                $table->foreignId(
                    'academy_assignment_id'
                )
                ->constrained(
                    'academy_assignments'
                )
                ->cascadeOnDelete();

                /**
                 * 1 = Lunes
                 * 2 = Martes
                 * 3 = Miércoles
                 * 4 = Jueves
                 * 5 = Viernes
                 * 6 = Sábado
                 * 7 = Domingo
                 */
                $table->tinyInteger(
                    'day_of_week'
                );

                $table->time(
                    'start_time'
                );

                $table->time(
                    'end_time'
                );

                $table->timestamps();

                $table->index(
                    [
                        'academy_assignment_id',
                        'day_of_week',
                    ],
                    'aas_assignment_day_idx'
                );

                $table->unique(
                    [
                        'academy_assignment_id',
                        'day_of_week',
                        'start_time',
                        'end_time',
                    ],
                    'aas_unique_schedule'
                );
            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'academy_assignment_schedules'
        );
    }
};