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
export class GeneralRouteGuardService implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router,
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const isLoggedIn = await firstValueFrom(this.authentication.isLoggedIn$);
      if (isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      console.error('Error in route guard:', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}
