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
  HttpClient,
} from '@angular/common/http';

import {
  environment,
} from '../../../../environments/environment';

@Component({
  selector: 'app-teacher-profile-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './teacher-profile-form.html',

  styleUrl:
    './teacher-profile-form.scss',
})
export class TeacherProfileFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly http =
    inject(HttpClient);

  userId!: number;

  profileId: number | null =
    null;

  isEditMode = false;

  loading = false;

  form = this.fb.group({

    first_name: [
      '',
      Validators.required,
    ],

    middle_name: [''],

    paternal_surname: [
      '',
      Validators.required,
    ],

    maternal_surname: [''],

    employee_number: [''],

    degree: [''],

    career: [''],

    specialty: [''],

    phone: [''],

    photo: [''],
  });

  ngOnInit(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      return;
    }

    this.userId =
      Number(id);

    this.loadProfile();
  }

  loadProfile(): void {

    this.loading = true;

    this.http.get(
      `${environment.apiUrl}/users/${this.userId}/teacher-profile`
    )
    .subscribe({

      next: (response: any) => {

        if (response.data) {

          this.profileId =
            response.data.id;

          this.isEditMode =
            true;

          this.form.patchValue({

            first_name:
              response.data.first_name,

            middle_name:
              response.data.middle_name,

            paternal_surname:
              response.data.paternal_surname,

            maternal_surname:
              response.data.maternal_surname,

            employee_number:
              response.data.employee_number,

            degree:
              response.data.degree,

            career:
              response.data.career,

            specialty:
              response.data.specialty,

            phone:
              response.data.phone,

            photo:
              response.data.photo,
          });
        }

        this.loading = false;
      },

      error: error => {

        console.error(error);

        this.loading = false;
      },
    });
  }

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const payload = {

      ...this.form.getRawValue(),

      user_id: this.userId,
    };

    const request =
      this.isEditMode
        ? this.http.put(
            `${environment.apiUrl}/teacher-profiles/${this.profileId}`,
            payload
          )
        : this.http.post(
            `${environment.apiUrl}/teacher-profiles`,
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/users',
        ]);
      },

      error: error => {

        console.error(error);
      },
    });
  }

  cancel(): void {

    this.router.navigate([
      '/users',
    ]);
  }
}