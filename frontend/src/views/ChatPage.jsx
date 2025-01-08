import React, { useState, useEffect, useCallback } from "react";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import ChatHeader from "../components/Chat/ChatHeader";
import Navbar from "../components/Chat/Navbar";
import { getMessages } from "../services/messageService";

const ChatPage = () => {
  const [clientId] = useState(() => Math.floor(new Date().getTime() / 1000));
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const user_id = localStorage.getItem("user_id"); // Obtener el userId del localStorage.

  // Manejar la seleccion del chat
  const handleSelectChat = async (chatId) => {
    setSelectedChat(chatId); // Actualiza el estado del chat seleccionado.

    try {
      const chatMessages = await getMessages(user_id, chatId); // Obtén los mensajes del backend.
      setMessages(chatMessages); // Actualiza el estado con los mensajes del chat.
    } catch (error) {
      console.error(`Error loading messages for chat ${chatId}:`, error.message);
    }
  };

  const sendMessage = useCallback(async () => {
    if (inputMessage.trim() && selectedChat) {
      const messageData = {
        chatId: selectedChat,
        userId: parseInt(userId, 10), // Asegurarse de que userId es un entero
        senderType: "user", // Asumimos que siempre es el usuario enviando
        content: inputMessage,
      };

      try {
        // Enviar el mensaje al backend
        const newMessage = await createMessage(messageData);

        // Actualizar mensajes en el estado local inmediatamente
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage(""); // Limpiar el campo de entrada
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    }
  }, [inputMessage, selectedChat, userId]);

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

  // const sendMessage = useCallback(() => {
  //   if (
  //     webSocket &&
  //     webSocket.readyState === WebSocket.OPEN &&
  //     inputMessage.trim()
  //   ) {
  //     const messageToSend = {
  //       clientId: clientId,
  //       message: inputMessage,
  //       time: new Date().toLocaleTimeString(),
  //     };

  //     // **Actualizar mensajes en el estado local inmediatamente**
  //     setMessages((prevMessages) => [...prevMessages, messageToSend]);

  //     // Enviar el mensaje al WebSocket
  //   webSocket.send(JSON.stringify(messageToSend));

  //   // Limpiar el campo de entrada
  //   setInputMessage("");
  //   }
  // }, [webSocket, inputMessage, clientId]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        onSelectChat={handleSelectChat}
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
