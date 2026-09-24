import axios from "axios";
import { getToken } from "./authStorage";

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api").replace(/\/+$/, "");

const api = axios.create({
    baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;