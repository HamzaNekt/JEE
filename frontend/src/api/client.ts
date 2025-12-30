import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
});

export const useApiClient = () => {
  const { token, logout } = useAuth();

  return useMemo(() => {
    const instance = api;
    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    instance.interceptors.response.use(
      (r) => r,
      (error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [token, logout]);
};

