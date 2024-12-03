import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

const clients = new Set<WebSocket>();
const emailStore: { [email: string]: WebSocket } = {};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', (ws) => {
    clients.add(ws);
    console.log(`New connection opened. Number of clients: ${clients.size}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'login' && data.email) {
          emailStore[data.email] = ws;
          console.log(`Stored email: ${data.email}`);
          ws.send(`Email stored successfully`);
        } else {
          console.log(`Received message: ${message}`);
          ws.send(`Hello, you sent: ${message}`);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
        ws.send('Invalid message format');
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      for (const email in emailStore) {
        if (emailStore[email] === ws) {
          delete emailStore[email];
          console.log(`Removed email: ${email}`);
          break;
        }
      }
      console.log(`Client disconnected. Total clients: ${clients.size}`);
    });
  });

  server.listen(3000, () => {
    console.log(
      'Application and WebSocket server are running on: http://localhost:3000',
    );
  });
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
