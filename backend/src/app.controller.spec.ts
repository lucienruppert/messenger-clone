import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AppController', () => {
  let appController: AppController;
  let connection: any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getConnectionToken(),
          useValue: {
            readyState: 1,
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    connection = app.get(getConnectionToken());
  });

  describe('root', () => {
    it('should return correct message when database is connected', () => {
      connection.readyState = 1;
      expect(appController.getHello()).toBe(
        'Hello World! - Database connection status is connected',
      );
    });

    it('should return correct message when database is disconnected', () => {
      connection.readyState = 0;
      expect(appController.getHello()).toBe(
        'Hello World! - Database connection status is disconnected',
      );
    });
  });
});
