import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, ChatComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
