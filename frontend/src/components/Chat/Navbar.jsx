import React from 'react';
import { MessageSquare, Plus, LogOut } from 'lucide-react';

const Navbar = ({ chats, onSelectChat, onNewChat, onLogout }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-full py-2 px-4 mb-4 bg-gray-700 hover:bg-gray-600 rounded"
      >
        <Plus size={18} className="mr-2" />
        Nueva conversación
      </button>
      <div className="flex-grow overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="flex items-center w-full py-2 px-4 mb-2 text-left hover:bg-gray-700 rounded"
          >
            <MessageSquare size={18} className="mr-2" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onLogout}
        className="flex items-center justify-center w-full py-2 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded"
      >
        <LogOut size={18} className="mr-2" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default Navbar;