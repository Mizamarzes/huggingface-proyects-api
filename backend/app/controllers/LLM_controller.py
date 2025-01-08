# controllers/llm_controller.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from config.db import get_db
from services.LLM_service import LLMService
from services.message_service import MessageService
from typing import List

router = APIRouter(
    prefix="/llm",
    tags=["llm"]
)

@router.post("/generate/{chat_id}")
async def generate_llm_response(
    chat_id: int,
    user_id: int,
    content: str,
    session: AsyncSession = Depends(get_db)
):
    """
    Genera una respuesta del modelo LLM para un mensaje en un chat específico
    """
    # Primero creamos el mensaje del usuario
    message_service = MessageService(session)
    user_message = await message_service.create_message(
        chat_id=chat_id,
        user_id=user_id,
        sender_type="user",
        content=content
    )

    # Luego generamos la respuesta del modelo
    llm_service = LLMService(session)
    model_response = await llm_service.generate_response(
        prompt=content,
        chat_id=chat_id
    )
    
    if not model_response:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate model response"
        )
    
    return {
        "user_message": user_message,
        "model_response": model_response
    }

@router.get("/chat/{chat_id}/messages", response_model=List[dict])
async def get_chat_messages(
    chat_id: int,
    session: AsyncSession = Depends(get_db)
):
    """
    Obtiene todos los mensajes de un chat, incluyendo las respuestas del modelo
    """
    llm_service = LLMService(session)
    messages = await llm_service.get_chat_history(chat_id)
    
    if not messages:
        raise HTTPException(
            status_code=404,
            detail="No messages found for this chat"
        )
    
    return messages