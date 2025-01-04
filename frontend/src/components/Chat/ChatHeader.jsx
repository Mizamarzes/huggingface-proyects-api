import React from "react";
import { MessageCircle } from "lucide-react";

const ChatHeader = ({ clientId }) => {
  return (
    <div className="bg-blue-600 text-white p-4">
      <h1 className="text-xl font-bold flex items-center">
        <MessageCircle className="mr-2" />
        Chat
      </h1>
      <h2 className="text-sm opacity-75">Your client ID: {clientId}</h2>
    </div>
  );
};

export default ChatHeader;
