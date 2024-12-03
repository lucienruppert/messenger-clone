import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { User } from '../types';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHttp: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockHttp = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: Router, useValue: mockRouter },
        { provide: HttpClient, useValue: mockHttp }
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize logged in state from session storage', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    service = TestBed.inject(AuthenticationService);
    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
  });

  it('should handle login successfully', async () => {
    const mockUser: User = { email: 'test@example.com', role: 'user' };
    mockHttp.post.and.returnValue(of(mockUser));

    await service.login('test@example.com', 'password');

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle logout', async () => {
    mockHttp.post.and.returnValue(of({}));

    await service.logout();

    service.isLoggedIn$.subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  afterEach(() => {
    sessionStorage.clear();
  });
});
