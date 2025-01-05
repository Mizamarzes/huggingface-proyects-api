from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from config.db import get_db
from services.user_service import UserService
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-super-secret-key-123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # Tiempo de expiración del token, un dia

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Modelo para el registro
class RegisterRequest(BaseModel):
    username: str
    password: str

# Modelo para el login (JSON)
class LoginRequest(BaseModel):
    username: str
    password: str

# Modelo para la respuesta de autenticación
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Endpoint: Registro de usuario
@router.post("/register")
async def register_user(
    register_data: RegisterRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo usuario.
    """

    user_service = UserService(session)
    user = await user_service.create_user(register_data.username, register_data.password)
    return {"id": user.id, "username": user.username}

# Endpoint: Login y generación de JWT
@router.post("/login", response_model=TokenResponse)
async def login_user(
    login_data: LoginRequest,
    session: AsyncSession = Depends(get_db)
):
    """
    Autentica al usuario y genera un token JWT.
    """

    user_service = UserService(session)
    user = await user_service.authenticate_user(login_data.username, login_data.password)
    
    # Crear token de acceso JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(user.id), "exp": datetime.utcnow() + access_token_expires},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer"}
