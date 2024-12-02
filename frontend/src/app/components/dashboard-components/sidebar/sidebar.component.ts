import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgStyle } from '@angular/common';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [NgStyle, CommonModule],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private isConnectedSubject = new BehaviorSubject<boolean>(true);
  public isConnected$ = this.isConnectedSubject.asObservable();
  private checkInterval = 5000; // Check every 5 seconds
  private subscription: Subscription | null = null;

  constructor(private http: HttpClient, private authentication: AuthenticationService) {}

  ngOnInit(): void {
    this.subscription = interval(this.checkInterval).subscribe(() => {
      this.http.get('http://localhost:3000').subscribe(
        () => this.isConnectedSubject.next(true),
        () => this.isConnectedSubject.next(false),
      );
    });
  }

  public logout(): void {
    this.authentication.logout();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
