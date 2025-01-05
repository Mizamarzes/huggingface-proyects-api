from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from datetime import datetime
from config.db import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"), nullable=True)
    sender_type = Column(Enum("user", "model", name="sender_type"), nullable=False)  # Quién envió el mensaje
    content = Column(String(1000), nullable=False) 
    timestamp = Column(DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "sender_type": self.sender_type,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        }