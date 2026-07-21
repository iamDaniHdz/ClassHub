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
  ActivatedRoute,
} from '@angular/router';

import {
  FormsModule,
} from '@angular/forms';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  AcademiesManagementService,
} from '../services/academies-management.service';

@Component({
  selector: 'app-academy-teachers',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './academy-teachers.html',

  styleUrl:
    './academy-teachers.scss',
})
export class AcademyTeachersComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly academiesService =
    inject(
      AcademiesManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  academyId!: number;

  teachers: any[] = [];

  availableTeachers: any[] =
    [];

  selectedTeacherId:
    number | null = null;

  loading = true;

  ngOnInit(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      return;
    }

    this.academyId =
      Number(id);

    this.loadTeachers();

    this.loadAvailableTeachers();
  }

  loadTeachers(): void {

    this.academiesService
      .getTeachers(
        this.academyId
      )
      .subscribe({

        next: (response: any) => {

          this.teachers =
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

  loadAvailableTeachers(): void {

    this.academiesService
      .getAvailableTeachers(
        this.academyId
      )
      .subscribe({

        next: (response: any) => {

          this.availableTeachers =
            response.data;
        },

        error: error => {

          console.error(error);
        },
      });
  }

  assignTeacher(): void {

    if (
      !this.selectedTeacherId
    ) {
      return;
    }

    this.academiesService
      .assignTeacher(
        this.academyId,
        this.selectedTeacherId
      )
      .subscribe({

        next: () => {

          this.selectedTeacherId =
            null;

          this.loadTeachers();
        },

        error: error => {

          console.error(error);
        },
      });
  }

  removeTeacher(
    userId: number
  ): void {

    const confirmed =
      confirm(
        '¿Deseas quitar este docente?'
      );

    if (!confirmed) {
      return;
    }

    this.academiesService
      .removeTeacher(
        this.academyId,
        userId
      )
      .subscribe({

        next: () => {

          this.loadTeachers();
        },

        error: error => {

          console.error(error);
        },
      });
  }
}