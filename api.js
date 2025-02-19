import { createServer } from 'node:http';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MARK: Express
const app = express();
const server = createServer(app);

// MARK: WebSocket Setup
const messageQueue = [];
const clients = new Set();
const messageHistory = []; // Add message history storage
const MAX_HISTORY = 50; // Maximum number of messages to store
const wss = new WebSocketServer({ server });

// Update username generation
const generateUsername = () => `user${Math.floor(Math.random() * 1000)}`;

// Queue processor
const processQueue = () => {
  if (messageQueue.length > 0) {
    const message = messageQueue.shift();
    // Store message in history
    messageHistory.push(message);
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift(); // Remove oldest message if limit reached
    }
    broadcast(message);
  }
};

// Broadcast to all connected clients
const broadcast = (message) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
};

// MARK: WebSocket Event Handlers
wss.on('listening', () => {
  console.log('WebSocket server listening on port 50000');
});

wss.on('connection', (ws) => {
  const username = generateUsername();
  ws.username = username;
  clients.add(ws);
  console.log(`Client connected as ${username}`);

  // Send message history to new client
  // biome-ignore lint/complexity/noForEach: <explanation>
  messageHistory.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      // Add username to the message
      const messageWithUser = {
        ...message,
        username: ws.username,
        timestamp: new Date().toISOString(),
      };
      messageQueue.push(messageWithUser);
      processQueue();
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });

  ws.on('error', console.error);
});

// Keep connections alive
setInterval(() => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  wss.clients.forEach((ws) => {
    ws.ping();
  });
}, 30000);

// MARK: Middlewares
app.use(cors());
app.use(express.json());

// MARK: Server
server.listen(process.env.PORT, () =>
  console.log(`\x1b[33mApp running on 🔥 PORT: ${process.env.PORT} \x1b[0m\n`),
);

// MARK: Routes
app.use('/', express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')),
);

export { server };
