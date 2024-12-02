import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgStyle } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [NgStyle, CommonModule],
})
export class SidebarComponent implements OnInit {
  private isConnectedSubject = new BehaviorSubject<boolean>(true);
  public isConnected$ = this.isConnectedSubject.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000', { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isConnectedSubject.next(!!response);
        },
        error: (error: HttpErrorResponse) => {
          this.isConnectedSubject.next(false);
        },
      });
  }

  public updateConnectionStatus(status: boolean): void {
    this.isConnectedSubject.next(status);
  }
}
