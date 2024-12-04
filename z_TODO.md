**Move Node backend from Railway to dotRoll**

[x] Register domain at dotroll
[x] Wait for domain approval
[x] Make sure SSL is live
[ ] Set up Node test 
[ ] Set up Node backend and make it operational

**Update message sending logic with name**

[ ] Change user db to include name!!!
[ ] After login get the name as well and save it to session storage
[ ] Send name with the initial login data to the server
[ ] Save the name as well in the client array

**List all clients on the left side**

[ ] On the server fetch names of all clients 
[ ] Create backend endpoint to provide all clients
[ ] Fetch list of all clients from the server
[ ] Display all but own 

**Initiating a chat with another client**

[ ] Click option to open chat
[ ] When sending the message, include the recipient's email in the messageData
[ ] Finalize message type (and replace any)

**Save message to the db and deliver message to recipient**

[ ] Create chat messages table in mysql
[ ] Set up ORM for nest.js
[ ] Create insert to the db
[ ] Save message to the db
[ ] Send message to the recipient
[ ] If the recipient is offline, the message stays in the database and is fetched when they reconnect.

**Multiple chats from the same client**

[ ] Make sure multiple chats work from the same client

**Status updates**

[ ] Update status when sent to the recipient
[ ] Update status when seen by the recipient
[ ] Update status on sender's computer

**Chat history**

[ ] On clicking on the person in the chatlist, chat history is loaded
[ ] On scrolling back up more messages appear, use loading indicator


 


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