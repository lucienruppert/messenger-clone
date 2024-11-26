/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GeneralRouteGuardService } from './general-route-guard.service';

describe('Service: GeneralRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralRouteGuardService]
    });
  });

  it('should ...', inject([GeneralRouteGuardService], (service: GeneralRouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
