import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

const clients = new Set<WebSocket>();
let emailStore: string[] = []; // Array to store all emails

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', (ws) => {
    clients.add(ws);
    console.log(`New connection opened. Number of clients: ${clients.size}`);

    // Send initial connection acknowledgment
    ws.send(
      JSON.stringify({
        type: 'connection',
        status: 'connected',
      }),
    );

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'login' && data.email) {
          if (!emailStore.includes(data.email)) {
            emailStore.push(data.email);
            console.log(`Stored new email: ${data.email}`);
            console.log(`Total emails stored: ${emailStore.length}`);
            console.log(`Current emails: ${emailStore.join(', ')}`);
          }
          ws.send(
            JSON.stringify({
              type: 'login_response',
              status: 'success',
              message: 'Email stored successfully',
            }),
          );
          (ws as any).email = data.email;

          const heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'heartbeat' }));
            } else {
              clearInterval(heartbeatInterval);
            }
          }, 30000);

          // Clear interval when connection closes
          ws.on('close', () => {
            clearInterval(heartbeatInterval);
          });
        } else {
          console.log(`Received message: ${message}`);
          ws.send(
            JSON.stringify({
              type: 'message_response',
              message: `Message received: ${message}`,
            }),
          );
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
    });

    ws.on('close', () => {
      clients.delete(ws);
      const email = (ws as any).email;
      if (email) {
        emailStore = emailStore.filter((emailItem) => emailItem !== email);
        console.log(`Removed email: ${email}`);
        console.log(`Total emails stored: ${emailStore.length}`);
        console.log(`Current emails: ${emailStore.join(', ')}`);
      }
      console.log(`Client disconnected. Total clients: ${clients.size}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
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
