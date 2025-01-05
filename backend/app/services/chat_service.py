from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from models.chat import Chat

class ChatDBService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_chat(self, user_id: int, name: str):
        """
        Crea un nuevo chat asociado a un usuario.
        """
        chat = Chat(user_id=user_id, name=name)
        self.session.add(chat)
        await self.session.commit()
        await self.session.refresh(chat)
        return chat

    async def get_chats_by_user(self, user_id: int):
        """
        Obtiene todos los chats asociados a un usuario.
        """
        result = await self.session.execute(
            select(Chat).where(Chat.user_id == user_id).order_by(Chat.created_at.desc())
        )
        chats = result.scalars().all()
        return [chat.to_dict() for chat in chats]

    async def get_chat_by_id(self, user_id: int, chat_id: int):
        """
        Obtiene un chat específico por ID, asegurándose de que pertenece al usuario.
        """
        result = await self.session.execute(
            select(Chat).where(and_(Chat.id == chat_id, Chat.user_id == user_id))
        )
        chat = result.scalar()
        return chat.to_dict() if chat else None
