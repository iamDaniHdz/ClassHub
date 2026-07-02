import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  // usuario NO autenticado
  if (!token) {
    console.log('Acceso denegado: no autenticado');
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};