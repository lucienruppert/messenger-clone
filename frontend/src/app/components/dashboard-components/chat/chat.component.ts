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
  private activePartnerSubscription: Subscription | null = null;

  @ViewChild('messageInputField') messageInputField!: ElementRef;

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
  }

  private focusMessageInput(): void {
    if (this.messageInputField?.nativeElement) {
      this.messageInputField.nativeElement.focus();
    }
  }

  public sendMessage(event: Event) {
    event.preventDefault();
    const email = sessionStorage.getItem('userEmail');
    console.log('partner', this.activePartner);
    if (email && this.activePartner) {
      const now = new Date();
      const mysqlDatetime = now.toISOString().slice(0, 19).replace('T', ' ');
      const messagePayload: Message = {
        senderEmail: email,
        recipientEmail: this.activePartner,
        type: 'chat',
        message: this.messageInput,
        timestamp: mysqlDatetime,
        status: 'sent'
      };
      this.webSocket.sendMessage(messagePayload);
    } else {
      console.error('User email or active partner not found');
    }
    this.messageInput = '';
    this.focusMessageInput();
  }
}
