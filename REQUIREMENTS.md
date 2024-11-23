# General Overview

**App Name:** Messenger Clone  
**Purpose:** A chat application for one-on-one messaging.  
**Design:**

- **Left Panel:** List of individual chats (with profile pictures, names, and recent messages).
- **Right Panel:** Chat window showing conversation history and an input field for sending messages.
- **Mobile Responsiveness:** Adapts gracefully for smaller screens.

---

# Priority Levels

- **P0:** Must have features for initial release
- **P1:** Important features for near-term updates
- **P2:** Nice-to-have features for future consideration

# Functional Requirements

## Chat Functionality

1. **Chats List (Left Panel):**

   - Display existing one-on-one chats with:
     - Contact name.
     - Profile picture.
     - Last message preview.
     - Timestamp of the last message.

2. **Chat Window (Right Panel):**

   - Display chat history incrementally with timestamps and sender info.
   - Scrollable chat history with virtual scrolling.

3. **Messaging:**
   - Send text messages.
   - Display "delivered" and "seen" statuses.
   - Support offline message queuing.

## Mobile Responsiveness

- Collapsible left panel for smaller screens.

---

# To Be Developed Later

1. Authentication (Sign Up and Log In).
2. Optionally, allow sending images or files.
3. Notify the user of typing status ("User is typing...").
4. Set status (online/offline) function.
5. Option to search for chats or users.
6. In-app and push notifications for new messages.
7. Badge counts for unread messages.

---

# Technical Requirements

## Front End

1. **Framework:** Angular.
2. **UI Library:** Tailwind CSS.
3. **API Integration:** Fetch for communicating with the back end.
4. **Routing:** Angular Router.
5. **Project Structure:**
   ```
   src/
   ├── app/
   │   ├── core/           # Singleton services, guards
   │   ├── shared/         # Common components, pipes
   │   ├── features/
   │   │   ├── chat/       # Chat window, messages
   │   │   └── contacts/   # Chat list, user list
   │   └── store/          # NgRx store, actions, effects
   ```

## Back End

1. **Framework:** NestJS for scalable, modular back-end architecture.
2. **Database:** MongoDB Atlas for flexible, document-based data storage
3. **Real-Time Updates:** WebSockets for messaging.
4. **WebSocket Events:**
   ```typescript
   enum WebSocketEvents {
     MESSAGE_SENT = "message.sent",
     MESSAGE_DELIVERED = "message.delivered",
     MESSAGE_SEEN = "message.seen",
     CHAT_UPDATED = "chat.updated",
   }
   ```

## Additional considerations:

1. **API Rate Limiting:**

   - Use NestJS middleware to prevent abuse by limiting the number of requests to the API.
   - Helps prevent overloading the server, especially in case of large-scale deployments later.

2. **Caching Strategy:**

   - Client-side caching with IndexedDB for offline support
   - Redis for server-side caching of chat history
   - Reduces database load and improves response times

3. **Logging & Monitoring:**

   - Use NestJS built-in logging or integrate with tools like **Winston** for detailed logs of incoming requests, errors, and application events.
   - Integrate with **Prometheus** and **Grafana** for application monitoring.

4. **Error Handling:**
   - Angular error boundaries for component-level error handling
   - Retry mechanisms with exponential backoff
   - Offline detection and recovery
   - Clear error indicators in UI

---

# APIs & Endpoints

## Authentication APIs (For later development)

- **POST /auth/signup** - Register a new user.
- **POST /auth/login** - Log in a user.
- **POST /auth/logout** - Log out the user.

## User APIs

- **GET /users** - Fetch list of users.
- **GET /users/:id** - Fetch user profile.

## Chat APIs

- **GET /chats** - Fetch all chats for the user.
- **GET /chats/:id/messages?before=timestamp&limit=50** - Fetch messages for a chat incrementally.
- **POST /chats/:id/messages** - Send a new message.
- **POST /chats/:id/messages/seen** - Mark messages as seen.
  ```json
  Body: { "messageIds": ["id1", "id2", ...] }
  ```

## Notification APIs (For later development)

- **GET /notifications** - Fetch unread message counts.

---

# Database Schema

## MongoDB Collections

1. **Users Collection:**

   ```javascript
   User {
     _id: ObjectId
     name: String
     avatar: String
     lastSeen: Date
     chats: [ObjectId] // References to chats
   }
   ```

2. **Chats Collection:**

   ```javascript
   Chat {
     _id: ObjectId
     participants: [ObjectId]
     lastMessage: {
       content: String
       senderId: ObjectId
       timestamp: Date
       status: String
     }
     updatedAt: Date
   }
   ```

3. **Messages Collection:**
   ```javascript
   Message {
     _id: ObjectId
     chatId: ObjectId
     senderId: ObjectId
     content: String
     timestamp: Date
     status: String
     deliveredAt: Date
     seenAt: Date
   }
   ```

# Error Handling

1. **Message Delivery:**

   - Retry failed messages 3 times with exponential backoff
   - Store failed messages locally for retry
   - Show clear error indicators to users

2. **Connection Issues:**

   - Automatically reconnect WebSocket on disconnection
   - Queue messages during offline periods
   - Show connection status to users

3. **Error Response Format:**
   ```json
   {
     "error": {
       "code": "ERROR_CODE",
       "message": "User-friendly message",
       "details": "Technical details (dev-only)"
     }
   }
   ```

# Testing Requirements

1. **Coverage Requirements:**

   - Minimum 80% unit test coverage
   - 100% coverage for critical paths (authentication, message delivery)

2. **Test Types:**

   - Unit Tests: All services and components using Vitest
   - Integration Tests: API endpoints and database operations
   - E2E Tests: Critical user journeys with Cypress
   - Performance Tests: Load testing for concurrent users

3. **Performance Criteria:**
   - Message delivery < 500ms
   - API response time < 200ms
   - Support 10,000 concurrent connections
   - WebSocket latency < 100ms

# Non-Functional Requirements

1. **Performance:**
   - Messages should load in under 1 second
   - Virtual scrolling for chat history
   - Client-side caching with IndexedDB
2. **Scalability:** Ensure the app can handle thousands of concurrent users.
3. **Security (For later versions):**
   - Encrypt passwords using bcrypt.
   - Secure data transmission with HTTPS.
   - Protect against NoSQL Injection and XSS.
4. **Backup & Recovery:** Regular database backups.
