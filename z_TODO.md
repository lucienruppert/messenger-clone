**Save message to the db and deliver message to recipient**

[ ] When a message is received for a specific pair save it to the database

  [x] Create chat messages table in mysql

  [ ] Set up ORM for nest.js
  [ ] Create insert to the db - , add a UUID if none

  [ ] Save message to the db

[ ] Send message to the recipient
[ ] If the recipient is offline, the message stays in the database and is fetched when they reconnect.
[ ] Chatlist: azok a résztvevők legyenek ott, akivel már chateltem.

**FIX**

[ ] Mi van, ha egy user több helyen is belogol. Működjön így is.

**KÉSŐBB**

[ ] Lehessen törölni vagy arhiválni a beszélgetést


[ ] When clicked on the name, download and display last 10 messages

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

[ ] Fix authentication.service CookieService injection problem

**Additional Features**

[ ] Use ping/pong frames if supported by your WebSocket library (instead of Heartbeat)
[ ] Heartbeat doesnt work, as when I go offline in a client, backend doesnt get this info.

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
 OK tea
[ ] Implement offline message queuing

[ ] Add error indicators in UI

**Create chatbot**

[ ] Randi-gyakorlás
[ ] Flört, szex

