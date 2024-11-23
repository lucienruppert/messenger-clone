# Data Models

## Core Models

### User Model
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen: Date;
}
```

### Message Model
```typescript
interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'seen';
  type: 'text' | 'media' | 'file';
}
```

### Chat/Conversation Model
```typescript
interface Chat {
  id: string;
  participants: string[];  // user IDs
  type: 'individual' | 'group';
  lastMessage: Message;
  createdAt: Date;
  updatedAt: Date;
}
```

## Model Relationships

### User Relationships
- **One-to-Many**: User to Messages
  - One user can send many messages
  - Each message belongs to exactly one user (sender)

### Chat Relationships
- **Many-to-Many**: Users to Chats
  - Many users can be in many different chats
  - Each chat can have multiple participants

### Message Relationships
- **One-to-Many**: Chat to Messages
  - One chat contains many messages
  - Each message belongs to exactly one chat
