# PresenterKit MVP

A real-time chat application built with modern web technologies, featuring instant messaging capabilities and automatic reconnection handling.

## 🚀 Tech Stack

### Frontend
- React 19 (Latest version with improved performance)
- Vite 6 (For fast development and optimized builds)
- TailwindCSS (For responsive and modern UI)
- WebSocket API (For real-time communication)

### Backend
- Node.js (Runtime environment)
- Express (Web framework)
- WebSocket (ws package for real-time server)
- CORS (Cross-origin resource sharing)

### Development Tools
- ESLint (Code linting)
- Biome (Code formatting and linting)
- Husky (Git hooks)
- Nodemon (Auto-restart during development)

## ✨ Features

### Real-time Communication
- Instant messaging with WebSocket
- Message history storage (up to 50 messages)
- Automatic message queuing and processing
- Connection status monitoring
- Auto-reconnection system (up to 5 attempts)
- Keep-alive mechanism with ping/pong

### User Experience
- Clean, modern interface with TailwindCSS
- Responsive design for all devices
- Real-time connection status indicators:
  - 🟢 Connected
  - 🟡 Reconnecting
  - 🔴 Disconnected
- Auto-generated unique usernames
- Message history for new users
- Disabled input when disconnected

### System Features
- Message queue management
- Connection state management
- Error handling and logging
- Cross-origin support
- Static file serving with proper MIME types

## 🛠 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sdlc-mvp
```

2. Install dependencies:
```bash
npm i
cd client && npm i
```

3. Create environment files:

    Root.env
    ```bash
    PORT = 5000
    ```
    Client.env
    ```bash
    VITE_WS = 'ws'
    ```

## 🚀 Usage
### Development
1. Start the backend server:
    ```bash
    npm run dev
    ```
2. Start the frontend development server:
    ```bash
    cd client && npm run dev
    ```
3. Visit http://localhost:5173 in your browser

### Production
Build and start the production server:
```bash
npm run build
npm run node
```

## 🔮 Future Improvements
- User authentication system
- Private messaging
- Message persistence with database
- File sharing capabilities
- Typing indicators
- Read receipts
- User profiles
- Room/Channel support

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request