import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/websocket.service';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  public messageInput = '';
  private activePartnerSubscription: Subscription | null = null;
  private activePartner: string | null = null;

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
    console.log('this.activePartner', this.activePartner)
    if (email && this.activePartner) {
      this.webSocket.sendMessage({
        message: this.messageInput,
        senderEmail: email,
        recipientEmail: this.activePartner,
        type: 'chat'
      });
    } else {
      console.error('User email or active partner not found');
    }
    this.messageInput = '';
  }
}
