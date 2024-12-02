import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ChatComponent } from './components/dashboard/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { GeneralRouteGuardService } from './services/general-route-guard.service';
import { AuthRedirectGuardService } from './services/auth-redirect-guard.service';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GeneralRouteGuardService],
  },
  { path: 'chat', component: ChatComponent },
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRedirectGuardService],
  },
];
