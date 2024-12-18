**FIX**

[ ] Login button fekete!
[ ] Login hiba üzenet ne legyen teal
[ ] Upon login I still might see earlier messages?
[ ] Chatlist: azok a résztvevők legyenek ott, akivel már chateltem.

**FIX**

[ ] Mi van, ha egy user több helyen is belogol. Működjön így is.

**KÉSŐBB**

[ ] Lehessen törölni vagy archiválni a beszélgetést

[ ] When clicked on the name, download and display last 10 messages

**Status updates**

[ ] Update status when sent to the recipient
[ ] Update status when seen by the recipient
[ ] Update status on sender's computer

**Chat history**

[ ] On scrolling back up more messages appear, use loading indicator

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
