from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from config.db import get_db
from services.chat_service import ChatDBService
from pydantic import BaseModel

router = APIRouter(
    prefix="/chats",
    tags=["chats"]
)

# Definir el modelo de entrada para crear un chat
class CreateChatRequest(BaseModel):
    user_id: int
    name: str

# Endpoint crea un nuevo chat
@router.post("/")
async def create_chat(
    chat_data: CreateChatRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Crea un nuevo chat.
    """
    chat_service = ChatDBService(session)
    chat = await chat_service.create_chat(chat_data.user_id, chat_data.name)
    return chat

# Endpoint obtiene todos los chats del usuario con el user_id 
@router.get("/{user_id}", response_model=List[dict])
async def get_chats_by_user(
    user_id: int,
    session: AsyncSession = Depends(get_db)
):
    """
    Obtiene todos los chats de un usuario.
    """
    chat_service = ChatDBService(session)
    chats = await chat_service.get_chats_by_user(user_id)
    if not chats:
        raise HTTPException(status_code=404, detail="No chats found for this user.")
    return chats

@router.get("/{user_id}/{chat_id}")
async def get_chat_by_id(
    user_id: int,
    chat_id: int,
    session: AsyncSession = Depends(get_db)
):
    """
    Obtiene un chat específico por su ID.
    """
    chat_service = ChatDBService(session)
    chat = await chat_service.get_chat_by_id(user_id, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or access denied.")
    return chat
