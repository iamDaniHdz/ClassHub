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
  StudentsManagementService,
} from '../services/students-management.service';

@Component({
  selector: 'app-students-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './students-list.html',

  styleUrl:
    './students-list.scss',
})
export class StudentsListComponent
  implements OnInit
{
  private readonly studentsService =
    inject(
      StudentsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  students: any[] = [];

  loading = true;

  displayedColumns = [
    'name',
    'classroom',
    'actions',
  ];

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.studentsService
      .getAll()
      .subscribe({

        next: (response: any) => {

          this.students =
            response.data;

          this.loading =
            false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.loading = false;
        }
      });
  }

  deleteStudent(
    studentId: number
  ): void {

    const confirmed =
      confirm(
        '¿Eliminar estudiante?'
      );

    if (!confirmed) {
      return;
    }

    this.studentsService
      .delete(studentId)
      .subscribe({

        next: () => {

          this.load();
        },

        error: error => {

          console.error(error);
        }
      });
  }
}
