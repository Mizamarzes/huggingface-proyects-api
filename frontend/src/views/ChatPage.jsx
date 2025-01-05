import React, { useState, useEffect, useCallback } from "react";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import ChatHeader from "../components/Chat/ChatHeader";
import { getMessages } from "../services/messageService";

const ChatPage = () => {
  const [clientId] = useState(() => Math.floor(new Date().getTime() / 1000));
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        <ChatHeader clientId={clientId} />
        <MessageList messages={messages} clientId={clientId} />
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
