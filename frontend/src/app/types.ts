export type User = {
  email: string;
  role: string;
  errors?: Array<string>;
};

export type MessageData = {
  id: string;
  chatId: string;
  senderId: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'seen';
};
