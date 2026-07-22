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
            'academy_assignment_pendings',
            function (Blueprint $table) {

                $table->id();

                $table->foreignId(
                    'academy_assignment_id'
                )
                ->constrained(
                    'academy_assignments'
                )
                ->cascadeOnDelete();

                $table->foreignId(
                    'created_by'
                )
                ->constrained(
                    'users'
                )
                ->cascadeOnDelete();

                $table->string(
                    'title'
                );

                $table->text(
                    'description'
                )
                ->nullable();

                $table->boolean(
                    'is_completed'
                )
                ->default(false);

                $table->timestamps();

                $table->index(
                    [
                        'academy_assignment_id',
                    ],
                    'aap_assignment_idx'
                );

                $table->index(
                    [
                        'created_by',
                    ],
                    'aap_created_by_idx'
                );

                $table->index(
                    [
                        'is_completed',
                    ],
                    'aap_completed_idx'
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
            'academy_assignment_pendings'
        );
    }
};