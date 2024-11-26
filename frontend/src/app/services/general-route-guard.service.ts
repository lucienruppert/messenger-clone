import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralRouteGuardService {
  constructor(
    private authentication: AuthenticationService,
    private router: Router,
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | Promise<boolean> {
    return !!this.authentication.getUserEmail() || this.router.navigate(['/']);
  }
}
