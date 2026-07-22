import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { schoolContextGuard } from './school-context-guard';

describe('schoolContextGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => schoolContextGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
