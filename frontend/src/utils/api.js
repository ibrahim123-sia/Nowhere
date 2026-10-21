import axios from "axios";

export const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const getToken = () => localStorage.getItem("userToken");

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Shared API client: base URL, auth header and session-expiry handling.
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  Object.assign(config.headers, authHeaders());
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 on a request that carried a token means the session expired.
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  }
);

// Normalises an axios error into the payload thunks reject with.
export const errorPayload = (error, fallback = "Something went wrong") => ({
  message: error.response?.data?.message || error.message || fallback,
  status: error.response?.status,
});

export default api;
