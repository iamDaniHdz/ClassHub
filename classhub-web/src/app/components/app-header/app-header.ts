import {
  Component,
  inject,
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  AuthService,
} from '../../core/services/auth';

import {
  SchoolContextService,
} from '../../features/school-context/services/school-context.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIcon,
    MatMenu,
    MatDivider,
    MatMenuModule,
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

  get isAdmin(): boolean {

    return this.authService
      .isAdmin();
  }

  get isTeacher(): boolean {

    return this.authService
      .isTeacher();
  }

  get user() {
    return this.authService.getUser();
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