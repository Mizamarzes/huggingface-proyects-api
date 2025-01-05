import axios from "axios";

const API_BASE_URL = "http://localhost:8000/auth"; 

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });

    // Guardar el token y el user_id en localStorage
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("user_id", response.data.user_id);

    return response.data; // Devuelve el token de acceso si es exitoso
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "Failed to login. Please try again.";
    throw new Error(errorMessage);
  }
};
