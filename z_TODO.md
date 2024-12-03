**Move Node backend from Railway to dotRoll**

[x] Register domain at dotroll
[x] Wait for domain approval
[ ] Make sure it SSL is live
[ ] Setup Node backend and make it operational

**Create messaging between the clients**

[x] Küldhessen a cliens üzenetet a szerverre
[x] If I refresh it disconnects connection
[x] Resend emailt after refresh
[x] When sending the message, always append the sender's email to it on the frontend and console.log it on the backend.
[x] Store from which client-email the message came from and console.log it with the message received


[ ] Finalize message type (and replace any)
[ ] List all clients on the left side
 


**Create and flow User information between backend and frontend**

   [ ] Create User data model OK
   [ ] Write a backend script that creates a new User entry in the database with hased password
   [ ] Write a frontend service that gets this User's information from the database 
   [ ] Modify the home component so that it display the received User data 
   [ ] Build chat list component with virtual scrolling
   [ ] Create chat window component
   [ ] Implement message display with timestamps
   [ ] Add message input and sending functionality
   [ ] Implement responsive design with Tailwind

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


   [ ] Remove 'role' from user schema-db-api-frontend flow

   [ ] Fix authentication.service CookieService injection problem

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