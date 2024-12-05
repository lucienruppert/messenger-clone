import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private activePartnerSubject = new BehaviorSubject<string | null>(null);
  activePartner$ = this.activePartnerSubject.asObservable();

  get activePartner(): string | null {
    return this.activePartnerSubject.value;
  }

  setActiveChat(partnerEmail: string) {
    this.activePartnerSubject.next(partnerEmail);
    console.log('Active chat set to:', this.activePartner);
  }
}
