import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private connection: Connection,
  ) {
    if (connection && connection.readyState === 1) {
      console.log('Connected to MongoDB');
    }
  }

  @Get()
  getHello(): string {
    return `${this.appService.getHello()} - Database connection status is ${this.connection.readyState === 1 ? 'connected' : 'disconnected'}`;
  }
}
