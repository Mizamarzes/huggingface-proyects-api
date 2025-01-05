import axios from "axios";

const API_URL = "http://localhost:8000/auth"; 

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error.response?.data?.detail || "Registration failed.";
  }
};
