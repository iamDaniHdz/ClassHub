import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  let authReq = req;

  // Agregar token automáticamente
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {

      if (error.status === 401) {
        console.log('Token expirado');

        localStorage.removeItem('token');

        router.navigateByUrl('/login');
      }

      return throwError(() => error);
    })
  );
};