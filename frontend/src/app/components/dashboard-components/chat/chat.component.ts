import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/websocket.service';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';
import { Message } from '../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  public messageInput = '';
  public activePartner: string | null = null;
  public messages: Message[] = [];
  private activePartnerSubscription: Subscription | null = null;
  private messagesSubscription: Subscription | null = null;

  @ViewChild('messageInputField') messageInputField!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private webSocket: WebSocketService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.activePartnerSubscription = this.chatService.activePartner$.subscribe((partnerEmail) => {
      this.activePartner = partnerEmail;
      if (partnerEmail) {
        setTimeout(() => this.focusMessageInput(), 100);
      }
    });

    this.messagesSubscription = this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngAfterViewInit() {
    if (this.activePartner) {
      this.focusMessageInput();
    }
  }

  ngOnDestroy() {
    if (this.activePartnerSubscription) {
      this.activePartnerSubscription.unsubscribe();
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  private focusMessageInput(): void {
    if (this.messageInputField?.nativeElement) {
      this.messageInputField.nativeElement.focus();
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer?.nativeElement) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  getCurrentUserEmail(): string {
    return sessionStorage.getItem('userEmail') || '';
  }

  isCurrentUser(email: string): boolean {
    return email === this.getCurrentUserEmail();
  }

  public sendMessage(event: Event) {
    event.preventDefault();
    const email = this.getCurrentUserEmail();
    console.log('partner', this.activePartner);
    if (email && this.activePartner && this.messageInput.trim()) {
      const now = new Date();
      const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
      const messagePayload: Message = {
        senderEmail: email,
        recipientEmail: this.activePartner,
        type: 'chat',
        message: this.messageInput.trim(),
        timestamp: mysqlDatetime,
        status: 'sent'
      };

      // Add message to local stream immediately
      this.chatService.addMessage(messagePayload);

      // Send message through WebSocket
      this.webSocket.sendMessage(messagePayload);

      this.messageInput = '';
      this.focusMessageInput();
    } else {
      console.error('User email or active partner not found');
    }
  }
}
