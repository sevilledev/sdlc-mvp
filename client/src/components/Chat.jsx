import { useEffect, useState } from 'react';

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:50000`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const messageWithId = {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMessages((prev) => [...prev, messageWithId]);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && ws) {
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
          />
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
