<?php

namespace App\Providers;

use App\Events\StudentCreated;
use App\Listeners\AssignStudentToAcademies;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    protected $listen = [
        StudentCreated::class => [AssignStudentToAcademies::class],
    ];
}
