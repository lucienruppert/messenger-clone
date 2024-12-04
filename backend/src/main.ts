import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

interface User {
  username: string;
  email: string;
}

const clients = new Set<WebSocket>();
let usersStore: User[] = []; // Array to store all users

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
        console.log(`Received message: ${JSON.stringify(incomingData)}`); // Test log

        if (
          incomingData.type === 'login' &&
          incomingData.email &&
          incomingData.name
        ) {
          console.log(
            `Processing login for: ${incomingData.name} (${incomingData.email})`, // Test log
          );

          const userExists = usersStore.some(
            (user) => user.email === incomingData.email,
          );
          if (!userExists) {
            usersStore.push({
              username: incomingData.name,
              email: incomingData.email,
            });
            console.log(
              `Stored new user: ${incomingData.name} (${incomingData.email})`,
            );
            console.log(`Total users stored: ${usersStore.length}`);
            console.log(`Current users: ${JSON.stringify(usersStore)}`);
          } else {
            console.log(
              `User already exists: ${incomingData.name} (${incomingData.email})`, // Test log
            );
          }
          ws.send(
            JSON.stringify({
              type: 'login_response',
              status: 'success',
              message: 'User stored successfully',
            }),
          );
          (ws as any).user = {
            username: incomingData.name,
            email: incomingData.email,
          };

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
          console.log(`Invalid login data: ${JSON.stringify(incomingData)}`); // Test log
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
      const user = (ws as any).user;
      if (user) {
        usersStore = usersStore.filter(
          (emailItem) => emailItem.email !== user.email,
        );
        console.log(`Removed user: ${user.username} (${user.email})`);
        console.log(`Total users stored: ${usersStore.length}`);
        console.log(`Current users: ${JSON.stringify(usersStore)}`); // Additional log
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
