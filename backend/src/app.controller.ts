import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private connection: Connection,
  ) {
    if (connection && connection.readyState === ConnectionStates.connected) {
      console.log('Connected to MongoDB');
    }
  }

  @Get()
  getConnectionStatus(): ConnectionStates {
    return this.connection.readyState;
  }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }
}
