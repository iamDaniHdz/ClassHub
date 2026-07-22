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
  ClassroomsManagementService,
} from '../services/classrooms-management.service';

import {
  RouterLink,
} from '@angular/router';

@Component({
  selector: 'app-classroom-academies',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './classroom-academies.html',

  styleUrl:
    './classroom-academies.scss',
})
export class ClassroomAcademiesComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly classroomsService =
    inject(
      ClassroomsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  classroomId!: number;

  assignments: any[] = [];

  academies: any[] = [];

  teachers: any[] = [];

  selectedAcademyId:
    number | null = null;

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

    this.classroomId =
      Number(id);

    this.loadAssignments();

    this.loadAcademies();
  }

  loadAssignments(): void {

    this.classroomsService
      .getAcademyAssignments(
        this.classroomId
      )
      .subscribe({

        next: (response: any) => {

          this.assignments =
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

  loadAcademies(): void {

    this.classroomsService
      .getAcademies()
      .subscribe({

        next: (response: any) => {

          this.academies =
            response.data;
        },

        error: error => {

          console.error(error);
        },
      });
  }

  academyChanged(): void {

    if (
      !this.selectedAcademyId
    ) {
      return;
    }

    this.selectedTeacherId =
      null;

    this.classroomsService
      .getAcademyTeachers(
        this.selectedAcademyId,
        this.classroomId
      )
      .subscribe({

        next: (response: any) => {

          this.teachers =
            response.data;
        },

        error: error => {

          console.error(error);
        },
      });
  }

  assignAcademy(): void {

    if (
      !this.selectedAcademyId ||
      !this.selectedTeacherId
    ) {
      return;
    }

    this.classroomsService
      .assignAcademy({
        academy_id:
          this.selectedAcademyId,

        classroom_id:
          this.classroomId,

        user_id:
          this.selectedTeacherId,
      })
      .subscribe({

        next: () => {

          this.loadAssignments();

          this.selectedAcademyId =
            null;

          this.selectedTeacherId =
            null;

          this.teachers = [];
        },

        error: error => {

          console.error(error);
        },
      });
  }

  deleteAssignment(
    assignmentId: number
  ): void {

    const confirmed =
      confirm(
        '¿Eliminar asignación?'
      );

    if (!confirmed) {
      return;
    }

    this.classroomsService
      .deleteAcademyAssignment(
        assignmentId
      )
      .subscribe({

        next: () => {

          this.loadAssignments();
        },

        error: error => {

          console.error(error);
        },
      });
  }
}