import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Cambia según tu configuración

export const fetchUserChats = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chats/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Error fetching chats. Please try again."
    );
  }
};

export const createNewChat = async (userId, name) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chats`, {
      user_id: userId,
      name,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Error creating chat. Please try again."
    );
  }
};