import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to the WebSocket server');
  ws.send('Hello from client!');
});

ws.on('message', (message) => {
  console.log(`Received message from server: ${message}`);
});

ws.on('error', (error) => {
  console.log(`Error occurred: ${error}`);
});

ws.on('close', () => {
  console.log('Disconnected from the WebSocket server');
});
