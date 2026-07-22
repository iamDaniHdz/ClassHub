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
  FormsModule,
} from '@angular/forms';

import {
  ActivatedRoute,
} from '@angular/router';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  AcademyAssignmentSchedulesService,
} from '../services/academy-assignment-schedules.service';

@Component({
  selector:
    'app-academy-assignment-schedules',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './academy-assignment-schedules.html',

  styleUrl:
    './academy-assignment-schedules.scss',
})
export class AcademyAssignmentSchedulesComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly schedulesService =
    inject(
      AcademyAssignmentSchedulesService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  academyAssignmentId!: number;

  schedules: any[] = [];

  loading = true;

  dayOfWeek = 1;

  startTime = '';

  endTime = '';

  ngOnInit(): void {

    const assignmentId =
      this.route.snapshot
        .paramMap
        .get('assignmentId');

    if (!assignmentId) {
      return;
    }

    this.academyAssignmentId =
      Number(
        assignmentId
      );

    this.loadSchedules();
  }

  loadSchedules(): void {

    this.schedulesService
      .getSchedules(
        this.academyAssignmentId
      )
      .subscribe({

        next: (response: any) => {

          this.schedules =
            response.data;

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

  save(): void {

    this.schedulesService
      .createSchedule({

        academy_assignment_id:
          this.academyAssignmentId,

        day_of_week:
          this.dayOfWeek,

        start_time:
          this.startTime,

        end_time:
          this.endTime,
      })
      .subscribe({

        next: () => {

          this.startTime = '';

          this.endTime = '';

          this.loadSchedules();
        },

        error: error => {

          alert(
            error.error?.message
          );
        },
      });
  }

  remove(
    scheduleId: number
  ): void {

    const confirmed =
      confirm(
        '¿Eliminar horario?'
      );

    if (!confirmed) {
      return;
    }

    this.schedulesService
      .deleteSchedule(
        scheduleId
      )
      .subscribe({

        next: () => {

          this.loadSchedules();
        },
      });
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
}