from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from models.message import Message
from models.chat import Chat

class MessageService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_message(self, chat_id: int, sender_type: str, content: str, user_id: int):
        # Validar si el chat pertenece al usuario
        result = await self.session.execute(
            select(Chat).where(and_(Chat.id == chat_id, Chat.user_id == user_id))
        )
        chat = result.scalars().first()
        if not chat:
            raise ValueError("Chat does not exist or is not accessible by the user.")

        # Crear el mensaje
        db_message = Message(chat_id=chat_id, sender_type=sender_type, content=content)
        self.session.add(db_message)
        await self.session.commit()
        await self.session.refresh(db_message)
        return db_message

    # Obtener mensajes según el usuario y el chat
    async def get_messages_by_user_and_chat(self, user_id: int, chat_id: int, limit: int = 10):
        result = await self.session.execute(
            select(Message)
            .join(Chat, Message.chat_id == Chat.id)  # Relación entre Message y Chat
            .where(and_(Chat.user_id == user_id, Message.chat_id == chat_id))
            .order_by(Message.timestamp.asc())
            .limit(limit)
        )
        messages = result.scalars().all()
        return [message.to_dict() for message in messages]