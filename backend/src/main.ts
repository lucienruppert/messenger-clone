import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

interface User {
  name: string;
  email: string;
}

const clients = new Set<WebSocket>();
let emailStore: User[] = [];

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
        message: 'You are connected',
      }),
    );

    ws.on('message', (message) => {
      try {
        const incomingMessage = JSON.parse(message.toString());
        console.log(`Received message: ${JSON.stringify(incomingMessage)}`);

        switch (incomingMessage.type) {
          case 'login':
            if (incomingMessage.senderEmail && incomingMessage.name) {
              const userExists = emailStore.some(
                (user) => user.email === incomingMessage.senderEmail,
              );
              if (!userExists) {
                emailStore.push({
                  name: incomingMessage.name,
                  email: incomingMessage.senderEmail,
                });
                console.log(`Total users stored: ${emailStore.length}`);
                console.log(`Current users: ${JSON.stringify(emailStore)}`);
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
              console.log(
                `Invalid login data: ${JSON.stringify(incomingMessage)}`,
              );
              ws.send(
                JSON.stringify({
                  type: 'error',
                  message: 'Invalid login data',
                }),
              );
            }
            break;

          case 'chat':
            ws.send(
              JSON.stringify({
                type: 'messageResponse',
                message: `Message received: ${message}`,
              }),
            );
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
    });

    ws.on('close', () => {
      clients.delete(ws);
      const user = (ws as any).user;
      if (user) {
        emailStore = emailStore.filter(
          (emailItem) => emailItem.email !== user.email,
        );
        console.log(`Removed user: ${user.name} (${user.email})`);
        console.log(`Total users stored: ${emailStore.length}`);
        console.log(`Current users: ${JSON.stringify(emailStore)}`);

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
