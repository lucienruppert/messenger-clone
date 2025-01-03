import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { WebSocketService } from '../../../services/websocket.service';
import { ChatService } from '../../../services/chat.service';
import { Subscription } from 'rxjs';
import { Partner } from '../../../types';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css'],
  standalone: true,
  imports: [CommonModule, NgFor],
})
export class ChatlistComponent implements OnInit, OnDestroy {
  partners: Partner[] = [];
  private partnersSubscription: Subscription | null = null;
  private currentUserEmail: string | null = null;
  public activePartner: string | null = null;
  public currentUserName: string | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private chatService: ChatService,
  ) {
    this.currentUserEmail = sessionStorage.getItem('userEmail');
    this.currentUserName = sessionStorage.getItem('userName');
    console.log('Current user email:', this.currentUserEmail);
  }

  ngOnInit() {
    this.partnersSubscription = this.webSocketService
      .getPartners()
      .subscribe((partners: Partner[]) => {
        if (this.currentUserEmail) {
          this.partners = partners.filter((partner) => {
            const isNotCurrentUser = partner.email !== this.currentUserEmail;
            return isNotCurrentUser;
          });
        } else {
          console.warn('No current user email found in session storage');
          this.partners = partners;
        }
      });
  }

  ngOnDestroy() {
    if (this.partnersSubscription) {
      this.partnersSubscription.unsubscribe();
    }
  }

  setActiveChat(partnerEmail: string) {
    this.activePartner = partnerEmail;
    this.chatService.setActiveChat(partnerEmail);
  }
}
