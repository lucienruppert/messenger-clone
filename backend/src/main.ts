import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
