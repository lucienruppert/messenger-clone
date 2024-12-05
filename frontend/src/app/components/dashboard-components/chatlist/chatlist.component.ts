import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../services/websocket.service';
import { Subscription } from 'rxjs';
import { User } from '../../../types';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatlistComponent implements OnInit, OnDestroy {
  partners: User[] = [];
  private partnersSubscription: Subscription | null = null;
  private currentUserEmail: string | null = null;

  constructor(private webSocketService: WebSocketService) {
    // Get current user's email from session storage
    this.currentUserEmail = sessionStorage.getItem('userEmail');
    console.log('Current user email:', this.currentUserEmail);
  }

  ngOnInit() {
    this.partnersSubscription = this.webSocketService.getPartners().subscribe((partners: User[]) => {
      console.log('Received all partners:', partners);
      // Filter out the current user from the partners list
      if (this.currentUserEmail) {
        this.partners = partners.filter(partner => {
          const isNotCurrentUser = partner.email !== this.currentUserEmail;
          console.log(`Partner ${partner.email} isNotCurrentUser: ${isNotCurrentUser}`);
          return isNotCurrentUser;
        });
      } else {
        console.warn('No current user email found in session storage');
        this.partners = partners;
      }
      console.log('Filtered partners list:', this.partners);
    });
  }

  ngOnDestroy() {
    if (this.partnersSubscription) {
      this.partnersSubscription.unsubscribe();
    }
  }
}
