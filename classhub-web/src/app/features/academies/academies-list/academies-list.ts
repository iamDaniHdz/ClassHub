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
  AcademiesService,
} from '../services/academies.service';

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-academies-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './academies-list.html',

  styleUrl:
    './academies-list.scss',
})
export class AcademiesListComponent
  implements OnInit, AfterViewInit
{
  private readonly academiesService =
    inject(
      AcademiesService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  academies: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.load();
  }

  ngAfterViewInit(): void {

    this.columns = [

      {
        key: 'academy_name',
        header: 'Academia',
        sortable: true,
      },

      {
        key: 'classroom_name',
        header: 'Grupo',
        sortable: true,
      },

      {
        key: 'students_count',
        header: 'Alumnos',
        sortable: true,
      },

      {
        key: 'teacher_name',
        header: 'Docente',
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

    this.academiesService
      .getAcademies()
      .subscribe({

        next: (
          response: any
        ) => {

          this.academies =
            response.data.map(
              (academy: any) => ({

                ...academy,

                academy_name:
                  academy.academy?.name ??
                  '',

                classroom_name:
                  academy.classroom?.name ??
                  '',

                teacher_name:
                  academy.teacher?.name ??
                  '',
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
}