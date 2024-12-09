import { Controller, Get } from '@nestjs/common';
import { AppService } from './services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return 'API is running';
  }

  @Get('chat')
  getHello(): string {
    return this.appService.getHello();
  }
}
