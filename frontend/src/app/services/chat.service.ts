import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../types';
import { environment } from '../environments/environment';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private activePartnerSubject = new BehaviorSubject<string | null>(null);
  activePartner$ = this.activePartnerSubject.asObservable();
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {
    // Subscribe to new messages from WebSocket
    this.webSocketService.message$.subscribe(message => {
      if (message && message.type === 'chat') {
        const currentUserEmail = sessionStorage.getItem('userEmail');
        const activePartner = this.activePartnerSubject.value;

        // Only add message if it's between current user and active partner
        if (currentUserEmail && activePartner && (
          (message.senderEmail === currentUserEmail && message.recipientEmail === activePartner) ||
          (message.senderEmail === activePartner && message.recipientEmail === currentUserEmail)
        )) {
          this.addMessage(message);
        }
      }
    });

    // Clear messages when no partner is selected
    this.activePartner$.subscribe(partner => {
      if (!partner) {
        this.messagesSubject.next([]);
      }
    });
  }

  get activePartner(): string | null {
    return this.activePartnerSubject.value;
  }

  setActiveChat(partnerEmail: string | null) {
    this.activePartnerSubject.next(partnerEmail);
    console.log('Active chat set to:', this.activePartner);
    if (partnerEmail) {
      const currentUserEmail = sessionStorage.getItem('userEmail');
      if (currentUserEmail) {
        this.fetchMessages(currentUserEmail, partnerEmail);
      }
    }
  }

  fetchMessages(user1: string, user2: string): void {
    this.http.get<Message[]>(`${environment.apiUrl}/messages?user1=${user1}&user2=${user2}`)
      .subscribe({
        next: (messages) => {
          this.messagesSubject.next(messages);
          console.log('Fetched messages:', messages);
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
          this.messagesSubject.next([]);
        }
      });
  }

  addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }
}
