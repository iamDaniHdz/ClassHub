import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Observable, catchError, of } from 'rxjs';

import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/services/auth';

import { UserService } from '../../core/services/user';

import { User } from '../../types/user';

import { ApiResponse } from '../../types/api';

import { MatCardModule } from '@angular/material/card';

import { AppHeaderComponent } from '../../components/app-header/app-header';

import { SchoolContextService } from '../school-context/services/school-context.service';

@Component({
  standalone: true,

  selector: 'app-dashboard',

  templateUrl: './dashboard.html',

  imports: [CommonModule, MatCardModule, RouterModule, AppHeaderComponent],
})
export class DashboardComponent {
  user$: Observable<ApiResponse<User> | null>;

  constructor(
    private readonly userService: UserService,

    private readonly router: Router,

    private readonly auth: AuthService,

    private readonly schoolContext: SchoolContextService,
  ) {
    const school = this.schoolContext.getSchool();

    /**
     * Obligar a seleccionar
     * una escuela activa
     */
    if (!school) {
      this.router.navigate(['/school-selector']);
    }

    this.user$ = this.userService.me().pipe(
      catchError((error) => {
        console.error('Error cargando usuario:', error);

        throw error;
      }),
    );
  }

  get currentSchoolName(): string {
    return this.schoolContext.getSchoolName() ?? 'Sin escuela seleccionada';
  }

  changeSchool(): void {
    this.router.navigate(['/school-selector']);
  }

  logout(): void {
    this.schoolContext.clear();

    this.auth.logout();

    this.router.navigate(['/login']);
  }

  force401(): void {
    console.log('Forzando token inválido');

    localStorage.setItem('token', 'token_fake');

    this.user$ = this.userService.me().pipe(
      catchError((error) => {
        console.error('Error forzado:', error);

        return of(null);
      }),
    );
  }
}
