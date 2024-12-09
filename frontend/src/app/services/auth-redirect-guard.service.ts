import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuardService implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router,
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const isLoggedIn = await firstValueFrom(this.authentication.isLoggedIn$);
    if (!isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
