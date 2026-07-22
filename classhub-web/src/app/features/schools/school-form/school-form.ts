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
  SchoolsManagementService,
} from '../services/schools-management.service';

@Component({
  selector: 'app-school-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './school-form.html',

  styleUrl:
    './school-form.scss',
})
export class SchoolFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  private readonly schoolsService =
    inject(
      SchoolsManagementService
    );

  schoolId: number | null =
    null;

  isEditMode = false;

  loading = false;

  form = this.fb.group({

    name: [
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

    this.schoolId =
      Number(id);

    this.isEditMode =
      true;

    this.loadSchool();
  }

  loadSchool(): void {

    this.schoolsService
      .getById(this.schoolId!)
      .subscribe({

        next: (response: any) => {

          this.form.patchValue({
            name:
              response.data.name,
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

    const payload =
      this.form.getRawValue();

    const request =
      this.isEditMode
        ? this.schoolsService.update(
            this.schoolId!,
            payload
          )
        : this.schoolsService.create(
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/schools',
        ]);
      },

      error: error => {

        console.error(error);
      },
    });
  }

  cancel(): void {

    this.router.navigate([
      '/schools',
    ]);
  }
}