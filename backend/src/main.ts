import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { WebSocketServer } from './websocket.module';
import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MessagesService } from './services/messages.service';

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  // Initialize TypeORM
  const dataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  });

  try {
    await dataSource.initialize();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database', err);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const server = http.createServer(app.getHttpAdapter().getInstance());
  const messagesService = app.get(MessagesService);
  new WebSocketServer(server, messagesService);

  server.listen(3000, () => {
    console.log(`Running in ${process.env.MODE} mode`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
