import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
  ClassroomsManagementService,
} from '../../classrooms/services/classrooms-management.service';

@Component({
  selector: 'app-student-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './student-form.html',

  styleUrl:
    './student-form.scss',
})
export class StudentFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly studentsService =
    inject(
      StudentsManagementService
    );

  private readonly classroomsService =
    inject(
      ClassroomsManagementService
    );

  classrooms: any[] = [];

  isEditMode = false;

  studentId: number | null =
    null;

  form = this.fb.group({

    name: [
      '',
      Validators.required,
    ],

    second_name: [
      '',
    ],

    paternal_surname: [
      '',
      Validators.required,
    ],

    maternal_surname: [
      '',
      Validators.required,
    ],

    student_enrollment: [
      '',
      Validators.required,
    ],

    is_active: [
      true,
    ],

    classroom_id: [
      '',
      Validators.required,
    ],
  });

  ngOnInit(): void {

    this.loadClassrooms();

    const id =
      this.route.snapshot.paramMap.get(
        'id'
      );

    if (!id) {
      return;
    }

    this.studentId =
      Number(id);

    this.isEditMode = true;

    this.loadStudent();
  }

  loadClassrooms(): void {

    this.classroomsService
      .getAll()
      .subscribe({

        next: (response: any) => {

          this.classrooms =
            response.data;
        }
      });
  }

  loadStudent(): void {

    this.studentsService
      .getById(this.studentId!)
      .subscribe({

        next: (response: any) => {

          this.form.patchValue(
            response.data
          );
        }
      });
  }

  save(): void {

    if (
      this.form.invalid
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const payload =
      this.form.getRawValue();

    const request =
      this.isEditMode
        ? this.studentsService.update(
            this.studentId!,
            payload
          )
        : this.studentsService.create(
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/students',
        ]);
      },

      error: error => {

        console.error(error);
      },
    });
  }

  cancel(): void {

    this.router.navigate([
      '/students',
    ]);
  }
}