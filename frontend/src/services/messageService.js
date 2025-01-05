import axios from "axios";

// Crear una instancia de Axios con la configuración base
const api = axios.create({
  baseURL: "http://localhost:8000", // URL base del backend
  timeout: 10000, // Tiempo de espera para la petición (en ms)
});

// Función para obtener mensajes
export const getMessages = async () => {
  try {
    const response = await api.get("/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Puedes añadir más funciones para otros endpoints, por ejemplo:
export const sendMessageToBackend = async (messageData) => {
  try {
    const response = await api.post("/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default api;
