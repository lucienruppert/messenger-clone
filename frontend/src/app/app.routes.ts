import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { GeneralRouteGuardService } from './services/general-route-guard.service';
import { AuthRedirectGuardService } from './services/auth-redirect-guard.service';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GeneralRouteGuardService],
  },
  { path: 'chat', component: ChatComponent },
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRedirectGuardService],
  },
];
