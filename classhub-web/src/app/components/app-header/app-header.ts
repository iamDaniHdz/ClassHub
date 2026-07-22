import {
  Component,
  inject,
} from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  AuthService,
} from '../../core/services/auth';

import {
  SchoolContextService,
} from '../../features/school-context/services/school-context.service';

@Component({
  selector: 'app-header',

  standalone: true,

  imports: [
    RouterLink,
  ],

  templateUrl: './app-header.html',

  styleUrl: './app-header.scss',
})
export class AppHeaderComponent {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly schoolContext =
    inject(
      SchoolContextService
    );

  get schoolName(): string {

    return (
      this.schoolContext
        .getSchoolName()
      ?? 'Sin escuela seleccionada'
    );
  }

  changeSchool(): void {

    this.schoolContext.clear();

    this.router.navigate([
      '/school-selector',
    ]);
  }

  logout(): void {

    this.schoolContext.clear();

    this.authService.logout();

    this.router.navigate([
      '/login',
    ]);
  }
}