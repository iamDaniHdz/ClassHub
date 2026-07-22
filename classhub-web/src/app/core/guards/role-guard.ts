import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import {
  UserService,
} from '../services/user';

import {
  map,
  catchError,
  of,
} from 'rxjs';

export const roleGuard:
CanActivateFn = (route) => {

  const router =
    inject(Router);

  const userService =
    inject(UserService);

  const allowedRoles =
    route.data?.[
      'roles'
    ] as string[] | undefined;

  if (
    !allowedRoles ||
    allowedRoles.length === 0
  ) {

    return true;
  }

  return userService
    .me()
    .pipe(

      map(res => {

        const user = res?.data;

        if (
          !user ||
          !user.role
        ) {

          router.navigateByUrl(
            '/login'
          );

          return false;
        }

        const userRole =
          user.role.key;

        if (
          allowedRoles.includes(
            userRole
          )
        ) {

          return true;
        }

        console.log(
          'Acceso denegado por rol'
        );

        if (
          userRole === 'admin'
        ) {

          router.navigateByUrl(
            '/dashboard'
          );

        } else if (
          userRole === 'teacher'
        ) {

          router.navigateByUrl(
            '/dashboard'
          );

        } else {

          router.navigateByUrl(
            '/login'
          );
        }

        return false;
      }),

      catchError(() => {

        router.navigateByUrl(
          '/login'
        );

        return of(false);
      })
    );
};