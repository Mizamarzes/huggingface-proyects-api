# services/llm_service.py
import os
from typing import Optional
import requests
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.message import Message

class LLMService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.api_url = "https://api-inference.huggingface.co/models/gpt2"
        self.headers = {
            "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}",
            "Content-Type": "application/json"
        }

    async def generate_response(self, prompt: str, chat_id: int) -> Optional[dict]:
        try:
            # Configuración de la petición
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": 100,
                    "num_return_sequences": 1,
                    "temperature": 0.7,
                    "top_p": 0.95
                }
            }
            
            # Realizar la petición a HuggingFace
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            
            # Procesar la respuesta
            generated_text = response.json()[0].get('generated_text', '')
            
            # Crear un nuevo mensaje con la respuesta del modelo
            model_message = Message(
                chat_id=chat_id,
                sender_type="model",
                content=generated_text
            )
            
            self.session.add(model_message)
            await self.session.commit()
            await self.session.refresh(model_message)
            
            return model_message.to_dict()
            
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return None

    async def get_chat_history(self, chat_id: int) -> list:
        try:
            result = await self.session.execute(
                select(Message)
                .where(Message.chat_id == chat_id)
                .order_by(Message.timestamp)
            )
            messages = result.scalars().all()
            return [message.to_dict() for message in messages]
        except Exception as e:
            print(f"Error fetching chat history: {str(e)}")
            return []