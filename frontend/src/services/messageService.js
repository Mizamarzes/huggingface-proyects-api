import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Cambia según tu configuración

// Obtener mensajes por usuario y chat
export const getMessages = async (userId, chatId, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/messages/${userId}/${chatId}?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for user ${userId} and chat ${chatId}:`, error);
    throw error;
  }
};

// Crear un nuevo mensaje
export const createMessage = async ({ chatId, userId, senderType, content }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, {
      chat_id: chatId,
      user_id: userId,
      sender_type: senderType,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating message:", error.response?.data || error.message);
    throw error;
  }
};

export default axios;
