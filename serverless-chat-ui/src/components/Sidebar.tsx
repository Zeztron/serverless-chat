import React from 'react';

interface SidebarProps {
  user: string;
  clients: string[];
  setTargetUser: (recipient: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, clients, setTargetUser }) => {
  return (
    <>
      <div className='flex-none border-r-2 border-gray-200 w-20 md:w-65'>
        <div className='flex sm:items-center justify-between py-10 px-5'>
          <div className='flex items-center space-x-2'>
            image
            <div className='text-2xl invisible md:visible'>
              <span className='text-gray-700 mr-3 font-bold'>Chats</span>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col py-2'>
        <div className='flex flex-col'>
          {clients.map((client, index) => (
            <div key={index}>
              <button
                className='flex items-center p-3 bg-white rounded-xl'
                onClick={() => setTargetUser(client)}
              >
                image
                <div className='flex items-center'>
                  <span className='mr-3 ml-2'>{client}</span>
                  <span className='text-green-500'>
                    <svg width='10' height='10'>
                      <circle cx='5' cy='5' r='5' fill='currentColor'></circle>
                    </svg>
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
