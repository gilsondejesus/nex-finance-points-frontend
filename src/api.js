import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // 10 segundos
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redireciona para login se for a rota de login
    if (error.config.url !== "/auth/login" && error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
