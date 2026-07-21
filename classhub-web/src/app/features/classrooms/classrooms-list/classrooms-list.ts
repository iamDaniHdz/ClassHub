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
  ClassroomsManagementService,
} from '../services/classrooms-management.service';

@Component({
  selector: 'app-classrooms-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './classrooms-list.html',

  styleUrl:
    './classrooms-list.scss',
})
export class ClassroomsListComponent
  implements OnInit
{
  private readonly classroomsService =
    inject(
      ClassroomsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  classrooms: any[] = [];

  loading = true;

  displayedColumns: string[] = [
    'group',
    'degree',
    'students',
    'actions',
  ];

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.classroomsService
      .getAll()
      .subscribe({

        next: (response: any) => {

          this.classrooms =
            response.data;

          this.loading =
            false;

          this.cdr.detectChanges();

          console.log(
            'CLASSROOMS',
            this.classrooms
          );
        },

        error: (error) => {

          console.error(
            error
          );

          this.loading =
            false;
        },
      });
  }

  deleteClassroom(
    classroomId: number
  ): void {

    console.log(
      'Eliminar grupo',
      classroomId
    );
  }
}