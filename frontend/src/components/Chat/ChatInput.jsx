import React from "react";
import { Send } from "lucide-react";

const ChatInput = ({ message, setMessage, sendMessage }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex items-center bg-gray-100 rounded-lg">
        <input
          className="flex-1 p-2 bg-transparent outline-none"
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="p-2 text-blue-600 hover:text-blue-800"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
