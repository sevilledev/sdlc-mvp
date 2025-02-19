const createWebSocketConnection = () => {
  const socket = new WebSocket(`ws://${window.location.hostname}:50000`);

  socket.onopen = () => {
    console.log('Connected to WebSocket');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Add unique ID to each message
    return { ...message, id: Math.random().toString(36).substr(2, 9) };
  };

  return socket;
};

export const websocketService = createWebSocketConnection();
