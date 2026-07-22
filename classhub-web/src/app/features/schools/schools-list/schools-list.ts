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
  RouterLink,
} from '@angular/router';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  SchoolsManagementService,
} from '../services/schools-management.service';

@Component({
  selector: 'app-schools-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './schools-list.html',

  styleUrl:
    './schools-list.scss',
})
export class SchoolsListComponent
  implements OnInit
{
  private readonly schoolsService =
    inject(
      SchoolsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  schools: any[] = [];

  loading = true;

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading = true;

    this.schoolsService
      .getAll()
      .subscribe({

        next: (response: any) => {

          this.schools =
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

  deleteSchool(
    schoolId: number
  ): void {

    const confirmed =
      confirm(
        '¿Deseas eliminar esta escuela?'
      );

    if (!confirmed) {
      return;
    }

    this.schoolsService
      .delete(schoolId)
      .subscribe({

        next: () => {

          this.load();
        },

        error: error => {

          console.error(error);
        },
      });
  }
}