import React, { useRef, useEffect } from "react";

const MessageList = ({ messages, clientId }) => {
  const messagesEndRef = useRef(null);

  // Desplazarse automáticamente al final cuando cambian los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const parseMessage = (value) => {
    // Si el mensaje es un string JSON, intentamos parsearlo
    if (typeof value.message === "string" && value.message.startsWith("{")) {
      try {
        const parsedMessage = JSON.parse(value.message);
        return parsedMessage.message;
      } catch (e) {
        return value.message;
      }
    }
    return value.message;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-130px)] flex flex-col">
      {messages.map((value, index) => {
        // Si el mensaje es "Connect" o "Offline", no lo mostramos
        if (value.message === "Connect" || value.message === "Offline") {
          return null;
        }

        return (
          <div
            key={index}
            className={`flex ${
              value.clientId === clientId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[75%] ${
                value.clientId === clientId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-xs opacity-75 mb-1">
                {value.clientId === clientId
                  ? "You"
                  : `Client ${value.clientId}`}
              </p>
              <p className="break-words">{parseMessage(value)}</p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
