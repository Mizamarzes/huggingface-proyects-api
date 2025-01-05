# controllers/message_controller.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from config.db import get_db
from services.message_service import MessageService

router = APIRouter(
    prefix="/messages",
    tags=["messages"]
)

@router.get("/", response_model=List[dict])
async def get_messages(
    limit: int = 50,
    session: AsyncSession = Depends(get_db)
):
    message_service = MessageService(session)
    return await message_service.get_recent_messages(limit)

@router.get("/{client_id}", response_model=List[dict])
async def get_messages_by_client(
    client_id: int,
    session: AsyncSession = Depends(get_db)
):
    message_service = MessageService(session)
    # Necesitarías agregar este método en message_service
    return await message_service.get_messages_by_client(client_id)