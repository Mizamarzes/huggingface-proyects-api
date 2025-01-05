from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_user(self, username: str, password: str):
        """
        Crea un usuario con contraseña encriptada.
        """
        hashed_password = pwd_context.hash(password)
        user = User(username=username, password=hashed_password)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def authenticate_user(self, username: str, password: str):
        """
        Autentica un usuario comparando la contraseña.
        """
        result = await self.session.execute(select(User).where(User.username == username))
        user = result.scalars().first()
        if user and pwd_context.verify(password, user.password):
            return user
        return None
