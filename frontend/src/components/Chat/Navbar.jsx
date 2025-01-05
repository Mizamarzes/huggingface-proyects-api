import React, { useState, useEffect } from "react";
import { MessageSquare, Plus, LogOut } from 'lucide-react';
import NewChatModal from './NewChatModal';
import { fetchUserChats } from "../../services/chatService";

const Navbar = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_id = localStorage.getItem("user_id");

  // Cargar la lista de chats del usuario al montar el componente
  useEffect(() => {
    const loadChats = async () => {
      try {
        const userChats = await fetchUserChats(user_id);
        setChats(userChats);
      } catch (error) {
        console.error("Error fetching user chats:", error.message);
      }
    };
    if (user_id) {
      loadChats();
    }
  }, [user_id]);

  // Función para actualizar la lista de chats
  const updateChats = (newChat) => {
    setChats([...chats, newChat]); // Agregar el nuevo chat a la lista
    setSelectedChat(newChat.id); // Seleccionar automáticamente el nuevo chat
    onSelectChat(newChat.id); // Notificar al componente padre
  };

  // Manejar la selección de un chat
  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    onSelectChat(chatId); // Notificar al componente padre
  };

  // Lógica para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    console.log("User logged out");
    navigate("/auth/login");
  };
  
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center w-full py-2 px-4 mb-4 bg-gray-700 hover:bg-gray-600 rounded"
      >
        <Plus size={18} className="mr-2" />
        Nueva conversación
      </button>
      <div className="flex-grow overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => handleSelectChat(chat.id)}
            className={`flex items-center w-full py-2 px-4 mb-2 text-left hover:bg-gray-700 rounded ${
              selectedChat === chat.id ? "bg-gray-700" : ""
            }`}
          >
            <div className="flex-shrink-0 w-6">
              <MessageSquare size={18} className="text-gray-300" />
            </div>
            <span className="ml-2 truncate text-gray-100">{chat.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center w-full py-2 px-4 mt-4 bg-red-600 hover:bg-red-700 rounded"
      >
        <LogOut size={18} className="mr-2" />
        Cerrar sesión
      </button>
      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user_id}
        updateChats={updateChats} 
      />
    </div>
  );
};

export default Navbar;