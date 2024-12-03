import { TestBed } from '@angular/core/testing';
import { AuthRedirectGuardService } from './auth-redirect-guard.service';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';

describe('AuthRedirectGuardService', () => {
  let service: AuthRedirectGuardService;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthRedirectGuardService,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthRedirectGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
