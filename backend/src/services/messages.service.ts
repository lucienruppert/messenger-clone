import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/Message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(message: Partial<Message>): Promise<Message> {
    try {
      console.log('Creating message with data:', message);
      const newMessage = this.messagesRepository.create(message);
      console.log('Created message entity:', newMessage);
      const savedMessage = await this.messagesRepository.save(newMessage);
      console.log('Saved message:', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }
}
