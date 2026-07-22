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
  forkJoin,
  of,
} from 'rxjs';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  UsersManagementService,
} from '../services/users-management.service';

@Component({
  selector: 'app-user-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './user-form.html',

  styleUrl:
    './user-form.scss',
})
export class UserFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly usersService =
    inject(
      UsersManagementService
    );

  isEditMode = false;

  userId: number | null =
    null;

  loading = false;

  roles: any[] = [];

  schools: any[] = [];

  selectedSchools:
    number[] = [];

  form = this.fb.group({

    name: [
      '',
      Validators.required,
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    password: [
      '',
    ],

    role_id: [
      null,
      Validators.required,
    ],
  });

  ngOnInit(): void {

    this.loadCatalogs();

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      return;
    }

    this.userId =
      Number(id);

    this.isEditMode = true;

    this.loadUser();
  }

  loadCatalogs(): void {

    forkJoin({

      roles:
        this.usersService
          .getRoles(),

      schools:
        this.usersService
          .getSchools(),

    }).subscribe({

      next: (
        response: any
      ) => {

        this.roles =
          response.roles.data;

        this.schools =
          response.schools.data;
      },

      error: error => {

        console.error(error);
      },
    });
  }

  loadUser(): void {

    this.usersService
      .getUser(
        this.userId!
      )
      .subscribe({

        next: (
          response: any
        ) => {

          const user =
            response.data;

          this.form.patchValue({

            name:
              user.name,

            email:
              user.email,

            role_id:
              user.role?.id,
          });

          this.selectedSchools =
            user.schools?.map(
              (school: any) =>
                school.id
            ) ?? [];
        },

        error: error => {

          console.error(error);
        },
      });
  }

  toggleSchool(
    schoolId: number,
    checked: boolean
  ): void {

    if (checked) {

      if (
        !this.selectedSchools
          .includes(
            schoolId
          )
      ) {

        this.selectedSchools
          .push(
            schoolId
          );
      }

      return;
    }

    this.selectedSchools =
      this.selectedSchools
        .filter(
          id =>
            id !== schoolId
        );
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
        ? this.usersService
            .updateUser(
              this.userId!,
              payload
            )
        : this.usersService
            .createUser(
              payload
            );

    request.subscribe({

      next: (
        response: any
      ) => {

        const userId =
          response.data.id;

        this.assignSchools(
          userId
        );
      },

      error: error => {

        console.error(error);
      },
    });
  }

  private assignSchools(
    userId: number
  ): void {

    if (
      this.selectedSchools
        .length === 0
    ) {

      this.finish();
      return;
    }

    const requests =
      this.selectedSchools
        .map(
          schoolId =>
            this.usersService
              .assignSchool(
                userId,
                schoolId
              )
        );

    forkJoin(
      requests
    ).subscribe({

      next: () => {

        this.finish();
      },

      error: error => {

        console.error(error);

        this.finish();
      },
    });
  }

  private finish(): void {

    this.router.navigate([
      '/users',
    ]);
  }

  cancel(): void {

    this.router.navigate([
      '/users',
    ]);
  }
}