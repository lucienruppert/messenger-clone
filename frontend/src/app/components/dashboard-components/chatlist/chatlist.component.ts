import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { WebSocketService } from '../../../services/websocket.service';
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

  constructor(private webSocketService: WebSocketService) {
    this.currentUserEmail = sessionStorage.getItem('userEmail');
    console.log('Current user email:', this.currentUserEmail);
  }

  ngOnInit() {
    this.partnersSubscription = this.webSocketService
      .getPartners()
      .subscribe((partners: Partner[]) => {
        console.log(
          'Raw partners data received:',
          JSON.stringify(partners, null, 2),
        );
        if (this.currentUserEmail) {
          this.partners = partners.filter((partner) => {
            const isNotCurrentUser = partner.email !== this.currentUserEmail;
            console.log(`Partner data:`, {
              email: partner.email,
              name: partner.name,
              isNotCurrentUser,
            });
            return isNotCurrentUser;
          });
        } else {
          console.warn('No current user email found in session storage');
          this.partners = partners;
        }
        console.log(
          'Final filtered partners list:',
          JSON.stringify(this.partners, null, 2),
        );
      });
  }

  ngOnDestroy() {
    if (this.partnersSubscription) {
      this.partnersSubscription.unsubscribe();
    }
  }
}
