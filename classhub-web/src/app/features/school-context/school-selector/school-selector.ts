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
  Router,
} from '@angular/router';

import {
  AppHeaderComponent,
} from '../../../components/app-header/app-header';

import {
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  SchoolsManagementService,
} from '../../schools/services/schools-management.service';

import {
  SchoolContextService,
} from '../services/school-context.service';

@Component({
  selector: 'app-school-selector',

  standalone: true,

  imports: [
    CommonModule,
    AppHeaderComponent,
    ...MATERIAL_IMPORTS,
  ],

  templateUrl:
    './school-selector.html',

  styleUrl:
    './school-selector.scss',
})
export class SchoolSelectorComponent
  implements OnInit
{
  private readonly schoolsService =
    inject(
      SchoolsManagementService
    );

  private readonly contextService =
    inject(
      SchoolContextService
    );

  private readonly cdr =
    inject(ChangeDetectorRef);  

  private readonly router =
    inject(Router);

  schools: any[] = [];

  loading = true;

  ngOnInit(): void {

    this.loadSchools();
  }

  loadSchools(): void {

    this.schoolsService
      .getAll()
      .subscribe({

        next: (
          response: any
        ) => {

          this.schools =
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

  selectSchool(
    school: any
  ): void {

    this.contextService
      .setSchool(school);

    this.router.navigate([
      '/dashboard',
    ]);
  }
}