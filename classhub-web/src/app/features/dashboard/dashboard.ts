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
} from '../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../shared/material/material';

import {
  DashboardOverviewService,
} from './services/dashboard-overview.service';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.scss',
})
export class DashboardComponent
  implements OnInit
{
  private readonly overviewService =
    inject(
      DashboardOverviewService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  loading = true;

  dashboard: any = null;

  ngOnInit(): void {

    this.loadDashboard();
  }

  loadDashboard(): void {

    this.overviewService
      .getOverview()
      .subscribe({

        next: (
          response: any
        ) => {

          this.dashboard =
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

  get isAdmin(): boolean {

    return (
      this.dashboard?.role ===
      'admin'
    );
  }

  get isTeacher(): boolean {

    return (
      this.dashboard?.role ===
      'teacher'
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
        day as keyof typeof days
      ] ?? ''
    );
  }
}