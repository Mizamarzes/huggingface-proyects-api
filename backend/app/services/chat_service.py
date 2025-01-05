from typing import List
from fastapi import WebSocket
import json
from datetime import datetime

class ChatService:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast_except_sender(self, message: str, sender: WebSocket):
        for connection in self.active_connections:
            if connection != sender:
                await connection.send_text(message)

    async def broadcast_to_all(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def format_message(self, client_id: int, message: str):
        return {
            "time": datetime.now().strftime("%H:%M"),
            "clientId": client_id,
            "message": message
        }

    async def send_offline_message(self, client_id: int, websocket: WebSocket):
        offline_message = await self.format_message(client_id, "Offline")
        await self.broadcast_except_sender(json.dumps(offline_message), websocket)