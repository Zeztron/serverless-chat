import { useState, useRef, useEffect } from 'react';
import { Chat, Login } from './components';
import Sidebar from './components/Sidebar';
import { Message } from './Message';
import { WebSocketConnector } from './WebSocketConnector';

const webSocketConnector = new WebSocketConnector();

function App() {
  const [username, setUsername] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [clients, setClients] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const webSocket = useRef(webSocketConnector);

  const loadMessages = (targetUser: string) => {
    webSocket.current.getConnection('url').send(
      JSON.stringify({
        action: 'getMessage',
        targetUser,
        limit: 1000,
      })
    );
  };

  const handleSetRecipient = (targetUser: string) => {
    setRecipient(targetUser);
    setMessages([]);
    loadMessages(targetUser);
  };

  if (username === '') return <Login setUsername={setUsername} />;

  const sendMessage = (message: string) => {
    webSocket.current.getConnection('url').send(
      JSON.stringify({
        action: 'sendMessage',
        recipient,
        message,
      })
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: username, message },
    ]);
  };

  return (
    <div className='flex'>
      <Sidebar
        user={username}
        clients={clients}
        setTargetUser={(targetUser) => handleSetRecipient(targetUser)}
      />
      <div flex-auto>
        <Chat
          recipient={recipient}
          messages={messages}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default App;
