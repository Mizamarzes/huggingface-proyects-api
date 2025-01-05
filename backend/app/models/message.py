from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from config.db import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer)
    message = Column(String(255))
    time = Column(DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            "id": self.id,
            "clientId": self.client_id,
            "message": self.message,
            "time": self.time.strftime("%H:%M")
        }