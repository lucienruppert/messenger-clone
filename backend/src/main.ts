import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_CONNECTION_STRING;

async function bootstrap() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB Atlas database');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
