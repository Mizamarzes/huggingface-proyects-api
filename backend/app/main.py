from fastapi import FastAPI, WebSocket, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from config.db import init_db, get_db
from controllers.chat_controller import handle_websocket
from controllers.message_controller import router as message_router

# Crear la instancia principal de FastAPI
app = FastAPI()

# Configuración de CORS (opcional, pero recomendado para pruebas y producción)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto para limitar el acceso en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar el router de mensajes
app.include_router(message_router)

# Endpoint de prueba para verificar que el servidor está funcionando
@app.get("/")
def home():
    return {"message": "Welcome home"}

# WebSocket endpoint
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: int,
    session: AsyncSession = Depends(get_db)
):
    """
    Maneja conexiones WebSocket y delega la lógica a la función handle_websocket.
    """
    await handle_websocket(websocket, client_id, session)

# Inicialización de la base de datos al arrancar el servidor
@app.on_event("startup")
async def startup_event():
    """
    Este evento se ejecuta al iniciar el servidor. Se asegura de que las tablas se creen.
    """
    await init_db()
