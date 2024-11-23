# Development Sequence for Messenger Clone

## Phase 1: Project Setup and Basic Structure

1. **Initial Project Setup**

   - [x] Set up Git repository with proper .gitignore

   - [x] Connect GitHub repository to Github

   - [X] Set up NestJS backend project in /backend folder without any functionality and with Vitest testing

   - [X] Test that  the service is running

   - [ ] Deploy the  server and retest

   - [ ] Set up Vitest for unit testing

   Make one change/create one file at a time.

   - [ ] Set up NestJS WebSocketModule

   - [ ] Set up MongoDB Atlas database

   - [ ] Set up a simple HTML file to test backend services




2. **Deploy to test backend setup**

   - [ ] [Deploy NestJS backend for testing purposes.](BACKEND-DEPLOYMENT.md)


3. **Create Basic Frontend Structure**

   - [ ] Create Angular frontend project with Angular CLI

   - [ ] Configure Tailwind CSS

   - [ ] Create the same functionality as in the test HTML file


4. **Frontend Structure**

   - [ ] Set up feature-based module structure one by one and test after each done:
   
      ```
      src/
      ├── app/
      │   ├── core/           # Singleton services, guards
      │   ├── shared/         # Common components, pipes
      │   ├── features/
      │   │   ├── chat/       # Chat window, messages
      │   │   └── contacts/   # Chat list, user list
      │   └── store/          
      ```

   - [ ] Implement responsive design with Tailwind

   - [ ] Set up Angular routing

   - [ ] Create basic services for API communication


5. **Backend Foundation**

   - [ ] Set up MongoDB Atlas connection

   - [ ] Create MongoDB collections and indexes

   - [ ] Set up WebSocket connection using NestJS WebSocketModule

   - [ ] Define WebSocket events:
      ```typescript
      enum WebSocketEvents {
        MESSAGE_SENT = 'message.sent',
        MESSAGE_DELIVERED = 'message.delivered',
        MESSAGE_SEEN = 'message.seen',
        CHAT_UPDATED = 'chat.updated'
      }
      ```


## Phase 2: Core Messaging Features (P0)

6. **Backend API Development**

   - [ ] Implement User APIs (GET /users, GET /users/:id)

   - [ ] Implement Chat APIs with pagination:
      ```
      GET /chats/:id/messages?before=timestamp&limit=50
      ```

   - [ ] Implement bulk operations:
      ```
      POST /chats/:id/messages/seen
      Body: { messageIds: string[] }
      ```

   - [ ] Implement message sending/receiving via WebSocket


7. **Frontend Chat Implementation**

   - [ ] Build chat list component with virtual scrolling

   - [ ] Create chat window component

   - [ ] Implement message display with timestamps

   - [ ] Add message input and sending functionality

   - [ ] Connect WebSocket client

   - [ ] Implement client-side caching with IndexedDB

   - [ ] Add error boundaries in components


8. **Error Handling & Reliability**

   - [ ] Implement retry mechanism with exponential backoff

   - [ ] Add offline detection and recovery

   - [ ] Implement offline message queuing

   - [ ] Add error indicators in UI


## Phase 3: Testing & Performance (P1)

9. **Testing Implementation**

   - [ ] Write unit tests with Vitest

   - [ ] Implement E2E tests with Cypress

   - [ ] Create integration tests for APIs

   - [ ] Set up performance testing


10. **Performance Optimization**

    - [ ] Implement Redis caching for chat history

    - [ ] Optimize virtual scrolling performance

    - [ ] Fine-tune IndexedDB caching strategy

    - [ ] Set up API rate limiting


11. **Monitoring Setup**

    - [ ] Integrate Winston for logging

    - [ ] Set up Prometheus metrics

    - [ ] Configure Grafana dashboards

    - [ ] Implement health checks


## Phase 4: DevOps & Deployment (P2)

12. **Deployment Preparation**

    - [ ] Set up CI/CD pipeline

    - [ ] Configure production environment

    - [ ] Set up MongoDB backup procedures

    - [ ] Document deployment process

    - [ ] Create monitoring dashboards


## Future Enhancements (P2)

13. **Additional Features**

    - [ ] Authentication system

    - [ ] File/image sharing

    - [ ] Typing indicators

    - [ ] Online/offline status

    - [ ] Search functionality

    - [ ] Push notifications


14. **Security Implementation**

    - [ ] User authentication with JWT

    - [ ] Rate limiting for API endpoints

    - [ ] Input validation and sanitization

    - [ ] CORS configuration

    - [ ] Password hashing

    - [ ] Request validation
