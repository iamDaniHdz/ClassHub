import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';

// Tipos
import { User } from '../../types/user';
import { ApiResponse } from '../../types/api';

// Material
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, MatCardModule]
})
export class DashboardComponent {

  user$: Observable<ApiResponse<User> | null>;

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService
  ) {
    this.user$ = this.userService.me().pipe(
      catchError(error => {
        console.error('Error cargando usuario:', error);
        return of(null);
      })
    );
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}