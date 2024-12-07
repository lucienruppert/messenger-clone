import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { WebSocketServer } from './websocket.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const server = http.createServer(app.getHttpAdapter().getInstance());
  new WebSocketServer(server);

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
