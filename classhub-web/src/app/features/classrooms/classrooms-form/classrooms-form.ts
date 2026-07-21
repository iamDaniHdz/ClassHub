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
  ClassroomsManagementService,
} from '../services/classrooms-management.service';

@Component({
  selector: 'app-classrooms-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './classrooms-form.html',

  styleUrl:
    './classrooms-form.scss',
})
export class ClassroomsFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  private readonly classroomsService =
    inject(
      ClassroomsManagementService
    );

  isEditMode = false;

  classroomId: number | null =
    null;

  loading = false;

  form = this.fb.group({
    degree: [
      '',
      Validators.required,
    ],

    group: [
      '',
      Validators.required,
    ],
  });

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

    this.isEditMode =
      true;

    this.loadClassroom();
  }

  loadClassroom(): void {

    if (!this.classroomId) {
      return;
    }

    this.classroomsService
      .getById(this.classroomId)
      .subscribe({
        next: (response: any) => {

          const classroom =
            response.data;

          this.form.patchValue({

            degree:
              classroom.degree,

            group:
              classroom.group,
          });
        },
      });
  }

  save(): void {

    if (
      this.form.invalid
    ) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const {
      degree,
      group,
    } = this.form.getRawValue();

    const payload = {

      degree,

      group,

      name:
        `${degree}${group}`,
    };

    const request =
      this.isEditMode
        ? this.classroomsService.update(
            this.classroomId!,
            payload
          )
        : this.classroomsService.create(
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/classrooms',
        ]);
      },

      error: error => {

        console.error(error);

        this.loading = false;
      },
    });
  }

  cancel(): void {

    this.router.navigate([
      '/classrooms',
    ]);
  }
}