import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';

import { CommonModule } from '@angular/common';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import { MATERIAL_IMPORTS }
from '../../../shared/material/material';

import {
  ClassroomsService,
} from '../services/classrooms.service';

@Component({
  selector: 'app-classroom-detail',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
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

  displayedColumns = [
    'name',
    'actions',
  ];

  loading = true;

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = Number(
        params.get('id')
      );

      this.classroomsService
        .getById(id)
        .subscribe({
          next: (response: any) => {

            this.classroom = response.data;

            this.loading = false;

            this.cdr.detectChanges();

          },

          error: (error) => {

            console.error(error);

            this.loading = false;
          },
        });

    });

  }
}