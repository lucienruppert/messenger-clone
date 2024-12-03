import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [NgStyle, CommonModule],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public isConnected$: Observable<boolean>;

  constructor(
    private authentication: AuthenticationService,
    private webSocketService: WebSocketService
  ) {
    this.isConnected$ = this.webSocketService.getConnectionStatus();
  }

  ngOnInit(): void {}

  public logout(): void {
    this.authentication.logout();
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
}
