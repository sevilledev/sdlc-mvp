import { useCallback, useEffect, useState } from 'react';

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket(
        `${import.meta.env.VITE_WS}://${window.location.hostname}:${import.meta.env.VITE_PORT}`,
      );

      socket.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        setWs(socket);
        setRetryCount(0);
      };

      socket.onclose = () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        setWs(null);

        // Attempt to reconnect if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          console.log(
            `Attempting to reconnect... (${retryCount + 1}/${maxRetries})`,
          );
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connectWebSocket();
          }, 3000); // Wait 3 seconds before retrying
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const messageWithId = {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
        };
        setMessages((prev) => [...prev, messageWithId]);
      };

      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (error) {
      console.error('Connection error:', error);
    }
  }, [retryCount]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && ws && isConnected) {
      const message = {
        type: 'message',
        content: inputMessage,
        id: Math.random().toString(36).substr(2, 9),
      };
      ws.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <div className='bg-white shadow rounded-lg p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected
                  ? 'bg-green-500'
                  : retryCount > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />
            <span className='text-sm text-gray-600'>
              {isConnected
                ? 'Connected'
                : retryCount > 0
                  ? `Reconnecting... (${retryCount}/${maxRetries})`
                  : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className='h-96 overflow-y-auto mb-4 p-2 border rounded'>
          {messages.map((msg) => (
            <div key={msg.id} className='mb-2'>
              <span className='font-bold'>{msg.username}:</span> {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className='flex gap-2'>
          <input
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className='flex-1 p-2 border rounded'
            placeholder='Type a message...'
            disabled={!isConnected}
          />
          <button
            type='submit'
            className={`px-4 py-2 rounded text-white ${
              isConnected
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isConnected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
