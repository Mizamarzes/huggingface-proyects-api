import React, { useState } from "react";
import { X } from "lucide-react";
import { createNewChat } from "../../services/chatService";

const NewChatModal = ({ isOpen, onClose, userId, updateChats }) => {
  const [chatName, setChatName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatName.trim()) {
      setError("The chat name cannot be empty.");
      return;
    }

    try {
      setError(null); // Limpiar errores anteriores
      const newChat = await createNewChat(userId, chatName); // Crear un nuevo chat
      updateChats(newChat); // Actualizar la lista de chats en el estado del Navbar
      setChatName(""); // Resetear el campo de entrada
      onClose(); // Cerrar el modal
    } catch (error) {
      setError(error.message || "Failed to create chat. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">New Conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-sm mb-2">
              {error}
            </div>
          )}
          <input
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="Name of conversation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatModal;
