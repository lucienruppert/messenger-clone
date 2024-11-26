/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthRedirectGuardService } from './auth-redirect-guard.service';

describe('Service: AuthRedirectGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthRedirectGuardService]
    });
  });

  it('should ...', inject([AuthRedirectGuardService], (service: AuthRedirectGuardService) => {
    expect(service).toBeTruthy();
  }));
});
