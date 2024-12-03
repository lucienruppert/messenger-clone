import { TestBed } from '@angular/core/testing';
import { GeneralRouteGuardService } from './general-route-guard.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('GeneralRouteGuardService', () => {
  let service: GeneralRouteGuardService;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [], {
      isLoggedIn$: new BehaviorSubject<boolean>(false)
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GeneralRouteGuardService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(GeneralRouteGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
