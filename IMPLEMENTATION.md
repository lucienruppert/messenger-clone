### INCREMENTAL FULL STACK PAIR PROGRAMMING ###

# Development Sequence for Messenger Clone

## Phase 1: Project Setup and Basic Structure

**Initial Project Setup**

   [x] Set up Git repository with proper .gitignore

   [x] Connect GitHub repository to Github

   [X] Set up NestJS backend project in /backend folder without any functionality and with Vitest testing

   [X] Test that the service is running

   [x] Deploy the server and retest

   [x] Set up Vitest for unit testing

**Setup Frontend**

   [x] Create Angular frontend project with Angular CLI

   [x] Configure Tailwind CSS

   [x] Test Tailwinds configuration by simplifying the app component and styling it with Tailwind.

**Connect frontend to backend**

   [x] Test connection between the frontend and the backend by getting the message "Hello World!" from the backend and display it in the middle of the frontend main app component and style it with Tailwind.

**Frontend Login Basic Structure**

   [x] Create the following folders for the frontend: components, pages and services

   [x] Create a home page component and a chat page component

   [x] Add routing to the two new pages

   [x] Move the display of message coming from the backend from app to home component

**Websocket basic implementation**

   [x] Implement websocket in the backend folder using its node_modules only

   [x] Create a simple .ts file to test it mimicking the client

**Connect database to the backend**

   [ ] Connect Mongo DB Atlas database with backend

   [ ] Create User data model

   [ ] Based on the User data model create a document in the database

   [ ] Write a backend script that creates a new User entry in the database with hased password

   [ ] Write a frontend service that gets this User's information from the database 
   
   [ ] Modify the home component so that it display the received User data 




   [ ] Build chat list component with virtual scrolling

   [ ] Create chat window component

   [ ] Implement message display with timestamps

   [ ] Add message input and sending functionality

   [ ] Implement responsive design with Tailwind

   [ ] Set up Angular routing

   [ ] Create basic services for API communication


**Backend API Development**

   [ ] Implement User APIs (GET /users, GET /users/:id)

   [ ] Implement Chat APIs with pagination:

   ```
   GET /chats/:id/messages?before=timestamp&limit=50
   ```

   [ ] Implement bulk operations:

   ```
   POST /chats/:id/messages/seen
   Body: { messageIds: string[] }
   ```

   [ ] Implement message sending/receiving via WebSocket






**Additional Features**

   [ ] Authentication system

   [ ] File/image sharing

   [ ] Typing indicators

   [ ] Online/offline status

   [ ] Search functionality

   [ ] Push notifications

   [ ] Implement client-side caching with IndexedDB

   [ ] Add error boundaries in components

   [ ] Integrate Winston for logging

   [ ] Set up Prometheus metrics

   [ ] Configure Grafana dashboards

   [ ] Implement health checks

   [ ] Set up MongoDB backup procedures

   [ ] Document deployment process

   [ ] Create monitoring dashboards

   [ ] Implement Redis caching for chat history

   [ ] Optimize virtual scrolling performance

   [ ] Fine-tune IndexedDB caching strategy

   [ ] Set up API rate limiting

   [ ] Implement E2E tests with Cypress

**Security Implementation**

   [ ] User authentication with JWT

   [ ] Rate limiting for API endpoints

   [ ] Input validation and sanitization

   [ ] CORS configuration

   [ ] Password hashing

   [ ] Request validation

**Error Handling & Reliability**

   [ ] Implement retry mechanism with exponential backoff

   [ ] Add offline detection and recovery

   [ ] Implement offline message queuing

   [ ] Add error indicators in UI