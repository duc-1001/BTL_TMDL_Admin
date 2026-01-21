import { logout, refreshAccessToken } from "@/services/auth.service";
import { fetchLogout } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import axios, { AxiosError } from "axios";

let store: {
    dispatch: (action: any) => void;
} = {
    dispatch: (_action: any) => {},
};
export const injectStore = (_store: { dispatch: (action: any) => void }) => {
    store = _store;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api" || "http://localhost:8000/api",
  withCredentials: true,
  timeout: 120000, // <-- Tăng lên 2 phút (120 giây) cho upload
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.headers?.["Content-Type"] === "multipart/form-data") {
      config.timeout = 300000; // <-- 5 phút cho upload file
    }

    if (config.params) {
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] == null) delete config.params[key];
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;

    const originalRequest: any = error.config;
    const url = originalRequest.url || "";

    if (url.includes("/auth/me")) {
      return Promise.reject(error);
    }

    if (url.includes("/auth/refresh-token")) {
      store.dispatch(fetchLogout());
      return Promise.reject(error);
    }


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject({
      success: false,
      status,
      message: data?.detail || data?.message || error.message || "An error occurred.",
      errors: data?.errors || null,
    });
  }
);

export default api;