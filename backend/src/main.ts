import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://luciendelmar:w77us2H1fyguW1gJ@cluster0.c0bviof.mongodb.net/?retryWrites=true&w=majority';

async function bootstrap() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB Atlas database');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
