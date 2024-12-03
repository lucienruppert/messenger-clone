import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import WebSocket from 'ws';
import * as http from 'http';

const clients = new Set<WebSocket>();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', (ws) => {
    clients.add(ws);
    console.log(`New connection opened. Number of clients: ${clients.size}`);

    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      ws.send(`Hello, you sent: ${message}`);
    });

    ws.on('close', () => {
      clients.delete(ws);
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
