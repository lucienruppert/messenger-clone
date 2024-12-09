import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard-components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { GeneralRouteGuardService } from './services/general-route-guard.service';
import { AuthRedirectGuardService } from './services/auth-redirect-guard.service';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GeneralRouteGuardService],
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRedirectGuardService],
  },
];
