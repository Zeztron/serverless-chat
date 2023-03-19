import { useState } from 'react';
import Login from './components/Login';

function App() {
  const [username, setUsername] = useState('');

  if (username === '') return <Login setUsername={setUsername} />;

  return <div className='App'>hello</div>;
}

export default App;
