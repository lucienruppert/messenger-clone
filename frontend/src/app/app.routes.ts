import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard-components/dashboard/dashboard.component';
import { ChatComponent } from './components/dashboard-components/chat/chat.component';
import { SidebarComponent } from './components/dashboard-components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { GeneralRouteGuardService } from './services/general-route-guard.service';
import { AuthRedirectGuardService } from './services/auth-redirect-guard.service';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GeneralRouteGuardService],
    children: [
      {
        path: 'chat',
        component: ChatComponent,
      },
      {
        path: 'sidebar',
        component: SidebarComponent,
      },
      {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRedirectGuardService],
  },
];
