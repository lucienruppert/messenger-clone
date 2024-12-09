import { Controller, Get, Query } from '@nestjs/common';
import { MessagesService } from './services/messages.service';
import { Message } from './entities/Message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessagesBetweenUsers(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ): Promise<Message[]> {
    return this.messagesService.getMessagesBetweenUsers(user1, user2);
  }
}
