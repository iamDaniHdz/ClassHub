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
  AcademiesManagementService,
} from '../services/academies-management.service';

import {
  DataTableComponent,
  DataTableColumn,
} from '../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-academies-management-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    DataTableComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './academies-management-list.html',

  styleUrl:
    './academies-management-list.scss',
})
export class AcademiesManagementListComponent
  implements OnInit, AfterViewInit
{
  private readonly academiesService =
    inject(
      AcademiesManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  @ViewChild(
    'actionsTemplate'
  )
  actionsTemplate!: TemplateRef<any>;

  academies: any[] = [];

  loading = true;

  columns: DataTableColumn[] = [];

  ngOnInit(): void {

    this.load();
  }

  ngAfterViewInit(): void {

    this.columns = [
      {
        key: 'name',
        header: 'Nombre',
        sortable: true,
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

  load(): void {

    this.loading = true;

    this.academiesService
      .getAll()
      .subscribe({

        next: (
          response: any
        ) => {

          this.academies =
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

  deleteAcademy(
    academyId: number
  ): void {

    const confirmed =
      confirm(
        '¿Deseas eliminar esta academia?'
      );

    if (!confirmed) {
      return;
    }

    this.academiesService
      .delete(
        academyId
      )
      .subscribe({

        next: () => {

          this.load();
        },

        error: error => {

          console.error(error);
        },
      });
  }
}