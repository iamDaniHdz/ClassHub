import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('AUTH GUARD TOKEN:', token);

  if (!token) {
    console.log('NO TOKEN → REDIRECT');
    router.navigate(['/login']);
    return false;
  }

  console.log('TOKEN OK');
  return true;
};