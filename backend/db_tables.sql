CREATE TABLE messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  chatId VARCHAR(36),
  senderEmail VARCHAR(255) NOT NULL,
  recipientEmail VARCHAR(255),
  message TEXT,
  timestamp BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL
);