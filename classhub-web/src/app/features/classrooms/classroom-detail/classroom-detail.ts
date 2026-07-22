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
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

import {
  ClassroomsService,
} from '../services/classrooms.service';

@Component({
  selector: 'app-classroom-detail',

  standalone: true,

  imports: [
    CommonModule,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './classroom-detail.html',

  styleUrl:
    './classroom-detail.scss',
})
export class ClassroomDetailComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly classroomsService =
    inject(ClassroomsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  classroom: any = null;

  students: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [
    {
      key: 'fullName',
      header: 'Alumno',
      sortable: true,
    },
  ];

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {

        const id = Number(
          params.get('id')
        );

        this.load(id);
      }
    );
  }

  private load(
    classroomId: number
  ): void {

    this.loading = true;

    this.classroomsService
      .getById(classroomId)
      .subscribe({

        next: (
          response: any
        ) => {

          this.classroom =
            response.data;

          this.students =
            response.data.students.map(
              (item: any) => ({

                id:
                  item.student.id,

                studentAssignmentId:
                  item.student_assignment_id,

                fullName: [
                  item.student.name,
                  item.student.paternal_surname,
                  item.student.maternal_surname,
                ]
                  .filter(Boolean)
                  .join(' '),
              })
            );

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.loading = false;
        },
      });
  }
}