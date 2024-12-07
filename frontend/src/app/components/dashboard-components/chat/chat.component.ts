import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ChatComponent implements OnInit, OnDestroy {
  public messageInput = '';
  public activePartner: string | null = null;
  private activePartnerSubscription: Subscription | null = null;

  constructor(
    private webSocket: WebSocketService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.activePartnerSubscription = this.chatService.activePartner$.subscribe((partnerEmail) => {
      this.activePartner = partnerEmail;
    });
  }

  ngOnDestroy() {
    if (this.activePartnerSubscription) {
      this.activePartnerSubscription.unsubscribe();
    }
  }

  public sendMessage(event: Event) {
    event.preventDefault();
    const email = sessionStorage.getItem('userEmail');
    console.log('partner', this.activePartner);
    if (email && this.activePartner) {
      const messagePayload: Message = {
        senderEmail: email,
        recipientEmail: this.activePartner,
        type: 'chat',
        message: this.messageInput,
        timestamp: Date.now(),
        status: 'sent'
      };
      this.webSocket.sendMessage(messagePayload);
    } else {
      console.error('User email or active partner not found');
    }
    this.messageInput = '';
  }
}
