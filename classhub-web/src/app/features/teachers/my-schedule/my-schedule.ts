import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  MyScheduleService,
} from '../services/my-schedule.service';

@Component({
  selector: 'app-my-schedule',

  standalone: true,

  imports: [
    CommonModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './my-schedule.html',

  styleUrl:
    './my-schedule.scss',
})
export class MyScheduleComponent
  implements OnInit
{
  private readonly scheduleService =
    inject(MyScheduleService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  loading = true;

  schedules: any[] = [];

  groupedSchedules:
    Record<string, any[]> = {};

  ngOnInit(): void {

    this.loadSchedule();
  }

  loadSchedule(): void {

    this.scheduleService
      .getSchedule()
      .subscribe({

        next: (response: any) => {

          this.schedules =
            response.data;

          this.groupByDay();

          this.loading =
            false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.loading =
            false;
        },
      });
  }

  private groupByDay(): void {

    this.groupedSchedules = {};

    this.schedules.forEach(
      schedule => {

        const day =
          this.getDayName(
            schedule.day_of_week
          );

        if (
          !this.groupedSchedules[
            day
          ]
        ) {

          this.groupedSchedules[
            day
          ] = [];
        }

        this.groupedSchedules[
          day
        ].push(schedule);
      }
    );
  }

  getDayName(
    day: number
  ): string {

    const days = {

      1: 'Lunes',

      2: 'Martes',

      3: 'Miércoles',

      4: 'Jueves',

      5: 'Viernes',

      6: 'Sábado',

      7: 'Domingo',
    };

    return (
      days[
        day as keyof
        typeof days
      ] ?? ''
    );
  }

  get dayKeys(): string[] {

    return Object.keys(
      this.groupedSchedules
    );
  }
}