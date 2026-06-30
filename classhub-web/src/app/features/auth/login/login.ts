import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Service
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = null;

    this.auth.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']); // dashboard
        },
        error: () => {
          this.error = 'Credenciales incorrectas';
          this.loading = false;
        }
      });
  }
}
``