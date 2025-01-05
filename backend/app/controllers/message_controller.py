# controllers/message_controller.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from config.db import get_db
from services.message_service import MessageService
from pydantic import BaseModel
from enum import Enum

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)

# Define el ENUM para sender_type
class SenderType(str, Enum):
    USER = "user"
    MODEL = "model"

# Modelo para crear un mensaje
class CreateMessageRequest(BaseModel):
    chat_id: int
    user_id: int
    sender_type: SenderType
    content: str

# Endpoint: crea un nuevo chat
@router.post("/")
async def create_message(
    message_data: CreateMessageRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Crea un nuevo mensaje.
    """
    message_service = MessageService(session)
    try:
        message = await message_service.create_message(
            chat_id=message_data.chat_id,
            user_id=message_data.user_id,
            sender_type=message_data.sender_type.value,  
            content=message_data.content
        )
        return message
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint: Obtener mensajes por usuario y chat
@router.get("/{user_id}/{chat_id}", response_model=List[dict])
async def get_messages_by_user_and_chat(
    user_id: int,
    chat_id: int,
    limit: int = 10,
    session: AsyncSession = Depends(get_db)
):
    """
    Obtener mensajes de un usuario específico en un chat específico.
    """
    message_service = MessageService(session)
    messages = await message_service.get_messages_by_user_and_chat(user_id, chat_id, limit)
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for the given user and chat.")
    return messages