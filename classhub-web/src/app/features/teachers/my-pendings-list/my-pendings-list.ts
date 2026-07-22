import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
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

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-my-pendings-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './my-pendings-list.html',

  styleUrl:
    './my-pendings-list.scss',
})
export class MyPendingsListComponent
  implements OnInit, AfterViewInit
{
  private readonly pendingsService =
    inject(MyPendingsService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'statusTemplate'
  )
  statusTemplate!: TemplateRef<any>;

  @ViewChild(
    'dueDateTemplate'
  )
  dueDateTemplate!: TemplateRef<any>;

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  pendings: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.loadPendings();
  }

  ngAfterViewInit(): void {

    this.columns = [

      {
        key: 'status',
        header: 'Status',
        cellTemplate:
          this.statusTemplate,
      },

      {
        key: 'title',
        header: 'Título',
        sortable: true,
      },

      {
        key: 'academy_name',
        header: 'Academia',
        sortable: true,
      },

      {
        key: 'classroom_name',
        header: 'Grupo',
        sortable: true,
      },

      {
        key: 'due_date',
        header: 'Fecha límite',
        sortable: true,
        cellTemplate:
          this.dueDateTemplate,
      },

      {
        key: 'actions',
        header: 'Acciones',
        cellTemplate:
          this.actionsTemplate,
      },
    ];

    this.cdr.detectChanges();
  }

  loadPendings(): void {

    this.pendingsService
      .getPendings()
      .subscribe({

        next: (
          response: any
        ) => {

          this.pendings =
            response.data.map(
              (pending: any) => ({

                ...pending,

                academy_name:
                  pending.assignment
                    ?.academy
                    ?.name ?? '',

                classroom_name:
                  `${pending.assignment?.classroom?.degree ?? ''}° ${pending.assignment?.classroom?.group ?? ''}`,
              })
            );

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