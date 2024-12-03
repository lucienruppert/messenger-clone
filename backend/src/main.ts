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
        const incomingData = JSON.parse(message.toString());
        if (incomingData.type === 'login' && incomingData.email) {
          if (!emailStore.includes(incomingData.email)) {
            emailStore.push(incomingData.email);
            console.log(`Stored new email: ${incomingData.email}`);
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
          (ws as any).email = incomingData.email;

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
          console.log(incomingData);
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
