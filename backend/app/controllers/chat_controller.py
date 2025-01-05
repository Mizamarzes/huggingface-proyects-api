from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from services.chat_service import ChatService
from services.message_service import MessageService
from datetime import datetime
import json

async def handle_websocket(websocket: WebSocket, client_id: int, session: AsyncSession):
    chat_service = ChatService()
    message_service = MessageService(session)

    await chat_service.connect(websocket)

    # Enviar mensajes recientes cuando el cliente se conecta
    recent_messages = await message_service.get_recent_messages()
    for message in recent_messages:
        await websocket.send_text(json.dumps(message))

    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                message_data = json.loads(data)
            except json.JSONDecodeError:
                message_data = {
                    "clientId": client_id,
                    "message": data
                }

            # Guardar mensaje en la base de datos
            if message_data.get("message") != "Connect":
                saved_message = await message_service.create_message(
                    client_id=message_data["clientId"],
                    message=message_data["message"]
                )
                
                # Broadcast del mensaje
                await chat_service.broadcast_except_sender(
                    json.dumps(saved_message.to_dict()),
                    websocket
                )
                
    except WebSocketDisconnect:
        chat_service.disconnect(websocket)
        # Opcional: Notificar solo a los clientes conectados, pero no guardar en la base de datos
        offline_message = {
            "clientId": client_id,
            "message": "Offline",
            "time": datetime.now().strftime("%H:%M")
        }
        await chat_service.broadcast_except_sender(json.dumps(offline_message), websocket)
