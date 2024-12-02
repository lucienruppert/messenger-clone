import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuardService implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> {
    return this.authentication.isLoggedIn$.pipe(first()).toPromise().then(isLoggedIn => {
      if (!isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/main']);
        return false;
      }
    });
  }
}
