import WebSocket from 'ws';
import * as http from 'http';

interface User {
  name: string;
  email: string;
}

export class WebSocketServer {
  private clients: Set<WebSocket>;
  private emailStore: User[];
  private wsServer: WebSocket.Server;

  constructor(server: http.Server) {
    this.clients = new Set<WebSocket>();
    this.emailStore = [];
    this.wsServer = new WebSocket.Server({ server });
    this.initialize();
  }

  private initialize(): void {
    this.wsServer.on('connection', (ws) => {
      this.handleNewConnection(ws);
      ws.on('message', (message) => this.handleMessage(ws, message));
      ws.on('close', () => this.handleClose(ws));
      ws.on('error', (error) => this.handleError(error));
    });
  }

  private handleNewConnection(ws: WebSocket): void {
    this.clients.add(ws);
    console.log(
      `New connection opened. Number of clients: ${this.clients.size}`,
    );

    ws.send(
      JSON.stringify({
        type: 'connection',
        message: 'You are connected',
      }),
    );
  }

  private handleMessage(ws: WebSocket, message: WebSocket.RawData): void {
    try {
      const incomingMessage = JSON.parse(message.toString());
      console.log(`Received message: ${JSON.stringify(incomingMessage)}`);

      switch (incomingMessage.type) {
        case 'login':
          this.handleLogin(ws, incomingMessage);
          break;

        case 'chat':
          this.handleChat(ws, message);
          break;

        default:
          console.log(
            `Unknown message type: ${JSON.stringify(incomingMessage)}`,
          );
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Unknown message type',
            }),
          );
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }),
      );
    }
  }

  private handleLogin(ws: WebSocket, incomingMessage: any): void {
    if (incomingMessage.senderEmail && incomingMessage.name) {
      const userExists = this.emailStore.some(
        (user) => user.email === incomingMessage.senderEmail,
      );
      if (!userExists) {
        this.emailStore.push({
          name: incomingMessage.name,
          email: incomingMessage.senderEmail,
        });
        console.log(`Total users stored: ${this.emailStore.length}`);
        console.log(`Current users: ${JSON.stringify(this.emailStore)}`);
      } else {
        console.log(
          `User already exists: ${incomingMessage.name} (${incomingMessage.senderEmail})`,
        );
      }

      ws.send(
        JSON.stringify({
          type: 'loginResponse',
          status: 'success',
          message: 'User stored successfully',
        }),
      );

      (ws as any).user = {
        name: incomingMessage.name,
        email: incomingMessage.senderEmail,
      };

      this.broadcastUsers();
      this.setupHeartbeat(ws);
    } else {
      console.log(`Invalid login data: ${JSON.stringify(incomingMessage)}`);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid login data',
        }),
      );
    }
  }

  private handleChat(ws: WebSocket, message: WebSocket.RawData): void {
    ws.send(
      JSON.stringify({
        type: 'messageResponse',
        message: `Message received: ${message}`,
      }),
    );
  }

  private handleClose(ws: WebSocket): void {
    this.clients.delete(ws);
    const user = (ws as any).user;
    if (user) {
      this.emailStore = this.emailStore.filter(
        (emailItem) => emailItem.email !== user.email,
      );
      console.log(`Removed user: ${user.name} (${user.email})`);
      console.log(`Total users stored: ${this.emailStore.length}`);
      console.log(`Current users: ${JSON.stringify(this.emailStore)}`);

      this.broadcastUsers();
    }
    console.log(`Client disconnected. Total clients: ${this.clients.size}`);
  }

  private handleError(error: Error): void {
    console.error('WebSocket error:', error);
  }

  private broadcastUsers(): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'users',
            users: this.emailStore,
          }),
        );
      }
    });
  }

  private setupHeartbeat(ws: WebSocket): void {
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'heartbeat' }));
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);

    ws.on('close', () => {
      clearInterval(heartbeatInterval);
    });
  }
}
