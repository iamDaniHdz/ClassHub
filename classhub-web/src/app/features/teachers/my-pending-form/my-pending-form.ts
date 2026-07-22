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
  MyPendingsService,
} from '../services/my-pendings.service';

@Component({
  selector: 'app-my-pending-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './my-pending-form.html',

  styleUrl:
    './my-pending-form.scss',
})
export class MyPendingFormComponent
  implements OnInit
{
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly service =
    inject(MyPendingsService);

  pendingId:
    number | null = null;

  isEditMode = false;

  assignments: any[] = [];

  form = this.fb.group({

    academy_assignment_id: [
      null,
      Validators.required,
    ],

    title: [
      '',
      Validators.required,
    ],

    description: [''],
  });

  ngOnInit(): void {

    this.loadAssignments();

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {
      return;
    }

    this.pendingId =
      Number(id);

    this.isEditMode =
      true;

    this.loadPending();
  }

  loadAssignments(): void {

    this.service
      .getMyAcademyAssignments()
      .subscribe({

        next: (
          response: any
        ) => {

          this.assignments =
            response.data;
        },

        error: error => {

          console.error(error);
        },
      });
  }

  loadPending(): void {

    this.service
      .getPending(
        this.pendingId!
      )
      .subscribe({

        next: (
          response: any
        ) => {

          const pending =
            response.data;

          this.form.patchValue({

            academy_assignment_id:
              pending.academy_assignment_id,

            title:
              pending.title,

            description:
              pending.description,
          });
        },

        error: error => {

          console.error(error);
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
        ? this.service.updatePending(
            this.pendingId!,
            payload
          )
        : this.service.createPending(
            payload
          );

    request.subscribe({

      next: () => {

        this.router.navigate([
          '/my-pendings',
        ]);
      },

      error: error => {

        console.error(error);
      },
    });
  }

  cancel(): void {

    this.router.navigate([
      '/my-pendings',
    ]);
  }
}