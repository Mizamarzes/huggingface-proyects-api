import React, { useState, useEffect, useCallback } from "react";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import ChatHeader from "../components/Chat/ChatHeader";

const ChatPage = () => {
  const [clientId] = useState(() => Math.floor(new Date().getTime() / 1000));
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const url = `ws://localhost:8000/ws/${clientId}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send("Connect");
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, message]);
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
    if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage.trim()) {
      webSocket.send(JSON.stringify({
        clientId: clientId,
        message: inputMessage
      }));
      setInputMessage("");
    }
  }, [webSocket, inputMessage, clientId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
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
