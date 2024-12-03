import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();
  private webSocket$: WebSocketSubject<any> | null = null;
  private subscription: Subscription | null = null;
  private reconnectSubscription: Subscription | null = null;

  constructor() {
    // Do not connect automatically
  }

  public connect(): void {
    if (!this.webSocket$ || this.webSocket$.closed) {
      this.webSocket$ = webSocket({
        url: 'ws://localhost:3000',
        openObserver: {
          next: () => {
            console.log('WebSocket connected');
            this.isConnectedSubject.next(true);
            if (this.reconnectSubscription) {
              this.reconnectSubscription.unsubscribe();
              this.reconnectSubscription = null;
            }
          }
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket connection closed');
            this.isConnectedSubject.next(false);
            this.reconnect();
          }
        }
      });

      this.subscription = this.webSocket$.pipe(
        retry({ delay: 3000 })
      ).subscribe({
        next: (message) => {
          console.log('WebSocket message received:', message);
          // Keep the connection alive after receiving the response
          if (typeof message === 'string' && message.includes('Email stored successfully')) {
            console.log('Login successful, maintaining connection');
          }
        },
        error: (error) => {
          console.error('WebSocket error:', error);
          this.isConnectedSubject.next(false);
          this.reconnect();
        },
        complete: () => {
          console.log('WebSocket connection completed');
          this.isConnectedSubject.next(false);
          this.reconnect();
        }
      });
    }
  }

  private reconnect(): void {
    if (!this.reconnectSubscription) {
      console.log('Starting reconnection attempts...');
      this.reconnectSubscription = timer(0, 3000).subscribe(() => {
        console.log('Attempting to reconnect...');
        if (!this.isConnectedSubject.value) {
          if (this.webSocket$) {
            this.webSocket$.complete();
            this.webSocket$ = null;
          }
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
          }
          this.connect();
        } else {
          if (this.reconnectSubscription) {
            this.reconnectSubscription.unsubscribe();
            this.reconnectSubscription = null;
          }
        }
      });
    }
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.isConnected$;
  }

  public disconnect(): void {
    console.log("Disconnect activated.")
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.reconnectSubscription) {
      this.reconnectSubscription.unsubscribe();
    }
    if (this.webSocket$) {
      this.webSocket$.complete();
    }
    this.isConnectedSubject.next(false);
  }

  public sendMessage(message: any): void {
    if (this.webSocket$ && !this.webSocket$.closed) {
      this.webSocket$.next(message);
      console.log("Logged in email sent:", message);
    } else {
      console.error("WebSocket is not connected");
      // If not connected, try to reconnect and send the message
      this.connect();
      setTimeout(() => {
        if (this.webSocket$ && !this.webSocket$.closed) {
          this.webSocket$.next(message);
          console.log("Logged in email sent after reconnection:", message);
        }
      }, 1000);
    }
  }
}
