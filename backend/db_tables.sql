CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  chatId VARCHAR(36),
  senderEmail VARCHAR(255) NOT NULL,
  recipientEmail VARCHAR(255),
  message TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL,
  INDEX idx_chatId (chatId),
  INDEX idx_senderEmail (senderEmail),
  INDEX idx_recipientEmail (recipientEmail),
  FOREIGN KEY (senderEmail) REFERENCES users_chat(email) ON DELETE CASCADE,
  FOREIGN KEY (recipientEmail) REFERENCES users_chat(email) ON DELETE CASCADE
);