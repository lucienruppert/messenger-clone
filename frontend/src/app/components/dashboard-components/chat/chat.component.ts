import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  public messageInput = '';

  constructor(private webSocket: WebSocketService) {}

  public sendMessage(event: Event) {
    event.preventDefault();
    this.webSocket.sendMessage(this.messageInput);
    this.messageInput = '';
  }
}
