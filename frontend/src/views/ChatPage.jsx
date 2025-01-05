import React, { useState, useEffect, useCallback } from "react";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import ChatHeader from "../components/Chat/ChatHeader";
import { getMessages } from "../services/messageService";
import Navbar from "../components/Chat/Navbar";

const ChatPage = () => {
  const [clientId] = useState(() => Math.floor(new Date().getTime() / 1000));
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState([
    { id: 1, title: "Chat 1" },
    { id: 2, title: "Chat 2" },
    // Agrega más chats según sea necesario
  ]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Función para cargar mensajes desde el backend cuando se monta el componente
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(); // Obtener mensajes del backend
        setMessages((prevMessages) => {
          const uniqueMessages = [...data, ...prevMessages];
          return uniqueMessages.sort((a, b) => new Date(a.time) - new Date(b.time));
        });
        
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages(); // Llamar a la función cuando el componente se monte
  }, []);

  // Efecto para manejar la conexión WebSocket
  useEffect(() => {
    const url = `ws://localhost:8000/ws/${clientId}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send("Connect");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some((msg) => msg.id === message.id);
        if (isDuplicate) return prevMessages;
        return [...prevMessages, message];
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    setWebSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [clientId]);

  const sendMessage = useCallback(() => {
    if (
      webSocket &&
      webSocket.readyState === WebSocket.OPEN &&
      inputMessage.trim()
    ) {
      const messageToSend = {
        clientId: clientId,
        message: inputMessage,
        time: new Date().toLocaleTimeString(),
      };

      // **Actualizar mensajes en el estado local inmediatamente**
      setMessages((prevMessages) => [...prevMessages, messageToSend]);

      // Enviar el mensaje al WebSocket
    webSocket.send(JSON.stringify(messageToSend));

    // Limpiar el campo de entrada
    setInputMessage("");
    }
  }, [webSocket, inputMessage, clientId]);

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId);
    // Aquí puedes agregar lógica para cargar los mensajes del chat seleccionado
  };

  const handleNewChat = () => {
    // Lógica para crear un nuevo chat
    const newChat = { id: chats.length + 1, title: `Chat ${chats.length + 1}` };
    setChats([...chats, newChat]);
    setSelectedChat(newChat.id);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Cerrar sesión");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        chats={chats}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader clientId={clientId} />
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} clientId={clientId} />
        </div>
        <ChatInput
          message={inputMessage}
          setMessage={setInputMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
