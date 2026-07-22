import {
  inject,
} from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import {
  SchoolContextService,
} from '../../features/school-context/services/school-context.service';

export const schoolContextGuard:
CanActivateFn = () => {

  const router =
    inject(Router);

  const schoolContext =
    inject(
      SchoolContextService
    );

  const school =
    schoolContext.getSchool();

  if (!school) {

    router.navigate([
      '/school-selector',
    ]);

    return false;
  }

  return true;
};