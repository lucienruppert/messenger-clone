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
  id: string;
  chatId: string;
  senderEmail: string;
  recipientEmail: string;
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'seen';
};
