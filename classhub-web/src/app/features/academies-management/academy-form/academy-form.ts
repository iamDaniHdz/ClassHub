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
  AcademiesManagementService,
} from '../services/academies-management.service';

@Component({
  selector: 'app-academy-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl: './academy-form.html',

  styleUrl: './academy-form.scss',
})
export class AcademyFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly academiesService =
    inject(
      AcademiesManagementService
    );

  academyId: number | null =
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

    this.academyId =
      Number(id);

    this.isEditMode =
      true;

    this.loadAcademy();
  }

  private loadAcademy(): void {

    if (!this.academyId) {
      return;
    }

    this.loading = true;

    this.academiesService
      .getById(this.academyId)
      .subscribe({

        next: (response: any) => {

          this.form.patchValue({

            name:
              response.data.name,

          });

          this.loading =
            false;
        },

        error: error => {

          console.error(error);

          this.loading = false;
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

    const payload =
      this.form.getRawValue();

    const request =
      this.isEditMode
        ? this.academiesService.update(
            this.academyId!,
            payload
          )
        : this.academiesService.create(
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/academies-management',
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
      '/academies-management',
    ]);
  }
}