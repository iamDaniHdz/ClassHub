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
  AcademiesManagementService,
} from '../services/academies-management.service';

@Component({
  selector: 'app-academies-management-list',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './academies-management-list.html',

  styleUrl:
    './academies-management-list.scss',
})
export class AcademiesManagementListComponent
  implements OnInit
{
  private readonly academiesService =
    inject(
      AcademiesManagementService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);

  academies: any[] = [];

  loading = true;

  ngOnInit(): void {

    this.load();
  }

  load(): void {

    this.loading = true;

    this.academiesService
      .getAll()
      .subscribe({

        next: (response: any) => {

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
      .delete(academyId)
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