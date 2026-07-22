import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
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

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-students-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './students-list.html',

  styleUrl:
    './students-list.scss',
})
export class StudentsListComponent
  implements OnInit, AfterViewInit
{
  private readonly studentsService =
    inject(
      StudentsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  students: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.load();
  }

  ngAfterViewInit(): void {

    this.columns = [

      {
        key: 'full_name',
        header: 'Nombre',
        sortable: true,
      },

      {
        key: 'classroom_name',
        header: 'Grupo',
        sortable: true,
      },

      {
        key: 'actions',
        header: 'Acciones',
        cellTemplate:
          this.actionsTemplate,
      },
    ];

    this.cdr.detectChanges();
  }

  load(): void {

    this.studentsService
      .getAll()
      .subscribe({

        next: (
          response: any
        ) => {

          this.students =
            response.data.map(
              (student: any) => ({

                ...student,

                classroom_name:
                  student.classroom?.name ??
                  'Sin grupo',
              })
            );

          this.loading =
            false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(
            error
          );

          this.loading =
            false;
        },
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

          console.error(
            error
          );
        },
      });
  }
}