import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

interface User {
  name: string; // Updated to use name instead of username
  email: string;
}

const clients = new Set<WebSocket>();
let emailStore: User[] = []; // Array to store all users

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

          const userExists = emailStore.some(
            (user) => user.email === incomingData.email,
          );
          if (!userExists) {
            emailStore.push({
              name: incomingData.name, // Updated to use name instead of username
              email: incomingData.email,
            });
            console.log(
              `Stored new user: ${incomingData.name} (${incomingData.email})`,
            );
            console.log(`Total users stored: ${emailStore.length}`);
            console.log(`Current users: ${JSON.stringify(emailStore)}`);
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
            name: incomingData.name, // Updated to use name instead of username
            email: incomingData.email,
          };

          // Send current users to the client
          ws.send(
            JSON.stringify({
              type: 'users',
              users: emailStore,
            }),
          );

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
        emailStore = emailStore.filter(
          (emailItem) => emailItem.email !== user.email,
        );
        console.log(`Removed user: ${user.name} (${user.email})`); // Updated to use name instead of username
        console.log(`Total users stored: ${emailStore.length}`);
        console.log(`Current users: ${JSON.stringify(emailStore)}`); // Additional log

        // Broadcast updated users list to all clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'users',
                users: emailStore,
              }),
            );
          }
        });
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
