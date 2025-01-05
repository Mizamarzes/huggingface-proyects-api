from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# URL de conexión a la base de datos (ajusta según tu configuración)
DATABASE_URL = "mysql+aiomysql://root:123456@localhost:3306/chatgpt2huggingface"

# Crear el motor de base de datos asíncrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Crear una sesión asíncrona para manejar las transacciones
async_session = async_sessionmaker(engine, expire_on_commit=False)

# Base para definir modelos
Base = declarative_base()

# Función para inicializar la base de datos (crear tablas automáticamente)
async def init_db():
    async with engine.begin() as conn:
        # Importar los modelos antes de crear tablas
        from models.message import Message
        from models.chat import Chat
        from models.user import User
        await conn.run_sync(Base.metadata.create_all)


# Dependency para obtener la sesión de la base de datos
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise e
