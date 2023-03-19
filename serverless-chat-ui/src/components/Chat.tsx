import React, { useState } from 'react';
import { Message } from '../Message';

interface ChatProps {
  recipient: string;
  messages: Message[];
  sendMessage: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ recipient, messages, sendMessage }) => {
  const [message, setMessage] = useState('');

  return (
    <div className='flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen'>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='flex items-center space-x-4'>
          image
          <div className='flex flex-col leading-tight'>
            <div className='text-2xl mt-1 flex items-center'>
              <span className='text-gray-700 mr-3'>{recipient}</span>
              <span className='text-green-500'>
                <svg width='10' height='10'>
                  <circle cx='5' cy='5' r='5' fill='currentColor'></circle>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        id='messages'
        className='flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-scree'
      ></div>
    </div>
  );
};

export default Chat;
