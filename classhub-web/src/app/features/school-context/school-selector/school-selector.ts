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
  MATERIAL_IMPORTS,
} from '../../../shared/material/material';

import {
  SchoolsManagementService,
} from '../../schools/services/schools-management.service';

import {
  SchoolContextService,
} from '../services/school-context.service';

import {
  AuthService,
} from '../../../core/services/auth';

@Component({
  selector: 'app-school-selector',

  standalone: true,

  imports: [
    CommonModule,
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

  private readonly authService =
    inject(AuthService);

  schools: any[] = [];

  loading = true;

  ngOnInit(): void {

    this.loadSchools();
  }

  loadSchools(): void {

    const request =
      this.authService.isAdmin()
        ? this.schoolsService.getAll()
        : this.schoolsService.getMySchools();

    request.subscribe({

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