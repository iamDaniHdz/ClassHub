import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('GUEST GUARD TOKEN:', token);

  if (token) {
    console.log('YA LOGUEADO → REDIRECT DASHBOARD');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};