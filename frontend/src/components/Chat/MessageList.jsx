import React, { useRef, useEffect } from 'react'

const MessageList = ({ messages, clientId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((value, index) => (
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
              {value.clientId === clientId ? "You" : `Client ${value.clientId}`}
            </p>
            <p>{value.message}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
