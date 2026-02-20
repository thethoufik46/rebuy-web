import axios from "axios";

const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api",
  timeout: 20000,
});

/* ✅ Attach token automatically */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;