export type User = {
  email: string;
  role: string;
  name: string;
  errors?: Array<string>;
};

export type Partner = {
  email: string;
  name: string;
};

export type Message = {
  id?: string;
  chatId?: string;
  senderEmail: string;
  recipientEmail?: string;
  type: 'login' | 'loginResponse' | 'chat' | 'heartbeat' | 'error' | 'connection' | 'users';
  message?: string;
  users?: Partner[];
  name?: string;
  timestamp?: number;
  status?: 'sent' | 'delivered' | 'seen' | 'failed';
};
