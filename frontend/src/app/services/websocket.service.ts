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
  private intentionalDisconnect: boolean = false;
  private partners = new BehaviorSubject<any[]>([]); // Initialize partners as a BehaviorSubject

  constructor() {
    // Check if user is logged in and connect if they are
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.connect();
      // Get the stored email and send it after connection
      const email = sessionStorage.getItem('userEmail');
      const name = sessionStorage.getItem('userName');
      if (email && name) {
        // Wait a bit for the connection to establish before sending
        setTimeout(() => {
          this.sendMessage({ type: 'login', email: email, name: name });
        }, 1000);
      }
    }
  }

  public connect(): void {
    this.intentionalDisconnect = false;
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
            if (!this.intentionalDisconnect) {
              this.reconnect();
            }
          }
        }
      });

      this.subscription = this.webSocket$.pipe(
        retry({ delay: 3000 })
      ).subscribe({
        next: (message) => {
          console.log('WebSocket message received:', message);
          // Keep the connection alive after receiving the response
          if (message.type === 'login_response' && message.status === 'success') {
            console.log('Login successful, maintaining connection');
          }
          if (message.type === 'users') {
            console.log('Users list received:', message.users);
            this.partners.next(message.users); // Update partners with received users data
          }
        },
        error: (error) => {
          console.error('WebSocket error:', error);
          this.isConnectedSubject.next(false);
          if (!this.intentionalDisconnect) {
            this.reconnect();
          }
        },
        complete: () => {
          console.log('WebSocket connection completed');
          this.isConnectedSubject.next(false);
          if (!this.intentionalDisconnect) {
            this.reconnect();
          }
        }
      });
    }
  }

  private reconnect(): void {
    if (!this.reconnectSubscription && !this.intentionalDisconnect) {
      console.log('Starting reconnection attempts...');
      this.reconnectSubscription = timer(0, 3000).subscribe(() => {
        console.log('Attempting to reconnect...');
        if (!this.isConnectedSubject.value && !this.intentionalDisconnect) {
          if (this.webSocket$) {
            this.webSocket$.complete();
            this.webSocket$ = null;
          }
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
          }
          this.connect();
          // Resend email after reconnection if available
          const email = sessionStorage.getItem('userEmail');
          const name = sessionStorage.getItem('userName');
          if (email && name) {
            setTimeout(() => {
              this.sendMessage({ type: 'login', email: email, name: name });
            }, 1000);
          }
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
    console.log("Disconnect activated.");
    this.intentionalDisconnect = true;
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
    this.webSocket$ = null;
    this.subscription = null;
    this.reconnectSubscription = null;
  }

  public sendMessage(message: any): void {
    if (this.webSocket$ && !this.webSocket$.closed) {
      this.webSocket$.next(message);
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket is not connected");
      // If not connected and not intentionally disconnected, try to reconnect and send the message
      if (!this.intentionalDisconnect) {
        this.connect();
        setTimeout(() => {
          if (this.webSocket$ && !this.webSocket$.closed) {
            this.webSocket$.next(message);
            console.log("Message sent after reconnection:", message);
          }
        }, 1000);
      }
    }
  }

  public getPartners(): Observable<any[]> {
    return this.partners.asObservable(); // Provide an observable for partners
  }
}
