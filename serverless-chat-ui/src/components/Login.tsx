import React, { useState } from 'react';

interface LoginProps {
  setUsername: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUsername }) => {
  const [user, setUser] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (): void => {
    if (user === '') {
      setError('Username cannot be empty');
      return;
    }
    setUsername(user);
  };

  return (
    <section className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='max-w-md w-full bg-white rounded p-6 space-y-4'>
        <div className='mb-4'>
          <p className='text-gray-600'>Sign In</p>
          <h2 className='text-xl font-bold'>Join the Chat</h2>
        </div>
        <div>
          <input
            className={`w-full p-4 text-sm bg-gray-50 focus:outline-none border rounded text-gray-600 ${
              error ? 'border-red-500' : 'border-gray-200'
            }`}
            type='text'
            placeholder='Username'
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          {error && (
            <span className='font-medium tracking-wide text-red-500 text-sx mt-1 ml-1'>
              {error}
            </span>
          )}
        </div>
        <div>
          <button
            onClick={handleLogin}
            className='w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200'
          >
            Join
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
