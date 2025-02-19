const createWebSocketConnection = () => {
  const socket = new WebSocket(`ws://${window.location.hostname}:50000`);

  socket.onopen = () => {
    console.log('Connected to WebSocket');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    return {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
    };
  };

  const sendMessage = (content) => {
    if (socket.readyState === WebSocket.OPEN) {
      const message = {
        content,
        timestamp: new Date().toISOString()
      };
      socket.send(JSON.stringify(message));
    }
  };

  return {
    socket,
    sendMessage
  };
};

export const websocketService = createWebSocketConnection();
