import { Chat } from './components/Chat';

export const App = () => {
  return (
    <div className='min-h-screen bg-gray-100 py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>WebSocket Chat</h1>
      <Chat />
    </div>
  );
};
