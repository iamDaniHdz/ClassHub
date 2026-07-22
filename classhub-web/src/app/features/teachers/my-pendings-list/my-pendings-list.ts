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
  RouterLink,
} from '@angular/router';

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
  selector: 'app-my-pendings-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './my-pendings-list.html',

  styleUrl:
    './my-pendings-list.scss',
})
export class MyPendingsListComponent
  implements OnInit
{
  private readonly pendingsService =
    inject(MyPendingsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  pendings: any[] = [];

  loading = true;

  ngOnInit(): void {

    this.loadPendings();
  }

  loadPendings(): void {

    this.pendingsService
      .getPendings()
      .subscribe({

        next: (
          response: any
        ) => {

          this.pendings =
            response.data;

          this.loading =
            false;

          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.loading =
            false;
        },
      });
  }

  toggleStatus(
    pending: any
  ): void {

    this.pendingsService
      .updatePending(
        pending.id,
        {
          is_completed:
            !pending.is_completed,
        }
      )
      .subscribe({
        next: () => {

          this.loadPendings();
        },
      });
  }

  deletePending(
    pendingId: number
  ): void {

    const confirmed =
      confirm(
        '¿Eliminar pendiente?'
      );

    if (!confirmed) {
      return;
    }

    this.pendingsService
      .deletePending(
        pendingId
      )
      .subscribe({
        next: () => {

          this.loadPendings();
        },
      });
  }

  isOverdue(
    pending: any
  ): boolean {

    if (
      !pending.due_date ||
      pending.is_completed
    ) {

      return false;
    }

    const dueDate =
      new Date(
        pending.due_date
      );

    const today =
      new Date();

    return dueDate < today;
  }
}