import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  ActivatedRoute,
} from '@angular/router';

import {
  CommonModule,
} from '@angular/common';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  StudentsService,
} from '../services/students.service';

@Component({
  selector: 'app-student-detail',

  standalone: true,

  imports: [
    CommonModule,
    AppHeaderComponent,
  ],

  templateUrl:
    './student-detail.html',

  styleUrl:
    './student-detail.scss',
})
export class StudentDetailComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly studentsService =
    inject(StudentsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  loading = true;

  data: any = null;

  ngOnInit(): void {

    const studentAssignmentId =
      Number(
        this.route.snapshot
          .paramMap
          .get(
            'studentAssignmentId'
          )
      );

    this.studentsService
      .getById(
        studentAssignmentId
      )
      .subscribe({
        next: (response: any) => {

          this.data =
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
}