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
  ClassroomsManagementService,
} from '../services/classrooms-management.service';

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-classrooms-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './classrooms-list.html',

  styleUrl:
    './classrooms-list.scss',
})
export class ClassroomsListComponent
  implements OnInit, AfterViewInit
{
  private readonly classroomsService =
    inject(
      ClassroomsManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  classrooms: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.load();
  }

  ngAfterViewInit(): void {

    this.columns = [

      {
        key: 'group',
        header: 'Grupo',
        sortable: true,
      },

      {
        key: 'degree',
        header: 'Grado',
        sortable: true,
      },

      {
        key: 'students_count',
        header: 'Alumnos',
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

    this.classroomsService
      .getAll()
      .subscribe({

        next: (
          response: any
        ) => {

          this.classrooms =
            response.data;

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

  deleteClassroom(
    classroomId: number
  ): void {

    const confirmed =
      confirm(
        '¿Deseas eliminar este grupo?'
      );

    if (!confirmed) {
      return;
    }

    this.classroomsService
      .delete(
        classroomId
      )
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