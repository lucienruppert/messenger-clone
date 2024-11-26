import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Hello, you sent: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
