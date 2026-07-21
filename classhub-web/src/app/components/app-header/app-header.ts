import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';

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

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login',
    ]);
  }
}