<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'academy_assignment_pendings',
            function (Blueprint $table) {

                $table->date(
                    'due_date'
                )
                ->nullable()
                ->after(
                    'description'
                );

                $table->index(
                    ['due_date'],
                    'aap_due_date_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::table(
            'academy_assignment_pendings',
            function (Blueprint $table) {

                $table->dropIndex(
                    'aap_due_date_idx'
                );

                $table->dropColumn(
                    'due_date'
                );
            }
        );
    }
};