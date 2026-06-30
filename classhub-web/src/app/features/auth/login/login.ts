import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { switchMap, tap, catchError, map, startWith } from 'rxjs/operators';

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

  email = '';
  password = '';

  // Trigger del login
  private loginTrigger$ = new Subject<void>();

  // Estado reactivo completo
  vm$ = this.loginTrigger$.pipe(
    switchMap(() =>
      this.auth.login(this.email, this.password).pipe(

        tap(() => {
          this.router.navigate(['/dashboard']);
        }),

        map(() => ({
          loading: false,
          error: null
        })),

        catchError((err) => {
          let errorMessage = 'Error inesperado';

          if (err.status === 401 || err.status === 422) {
            errorMessage = 'Credenciales incorrectas';
          } else if (err.status === 0) {
            errorMessage = 'No se pudo conectar al servidor';
          }

          return of({
            loading: false,
            error: errorMessage
          });
        }),

        startWith({
          loading: true,
          error: null
        })
      )
    ),

    // ESTADO INICIAL GLOBAL (CLAVE)
    startWith({
      loading: false,
      error: null
    })
  );

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loginTrigger$.next();
  }
}
