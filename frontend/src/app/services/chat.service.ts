import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private activePartnerSubject = new BehaviorSubject<string | null>(null);
  activePartner$ = this.activePartnerSubject.asObservable();
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  get activePartner(): string | null {
    return this.activePartnerSubject.value;
  }

  setActiveChat(partnerEmail: string) {
    this.activePartnerSubject.next(partnerEmail);
    console.log('Active chat set to:', this.activePartner);
    const currentUserEmail = sessionStorage.getItem('userEmail');
    if (currentUserEmail) {
      this.fetchMessages(currentUserEmail, partnerEmail);
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
}
