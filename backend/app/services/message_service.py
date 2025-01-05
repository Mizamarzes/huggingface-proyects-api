from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.message import Message

class MessageService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_message(self, client_id: int, message: str):
        db_message = Message(client_id=client_id, message=message)
        self.session.add(db_message)
        await self.session.commit()
        await self.session.refresh(db_message)
        return db_message

    async def get_recent_messages(self, limit: int = 50):
        result = await self.session.execute(
            select(Message).order_by(Message.time.asc()).limit(limit)
        )
        messages = result.scalars().all()
        return [message.to_dict() for message in messages]

    async def get_messages_by_client(self, client_id: int):
        result = await self.session.execute(
            select(Message)
            .where(Message.client_id == client_id)
            .order_by(Message.time.desc())
        )
        messages = result.scalars().all()
        return [message.to_dict() for message in messages]