
import axios from "axios";

// Fall back to relative path "/api" in local dev so Vite proxy works,
// or use explicit VITE_API_URL in production.
const baseURL = import.meta.env.VITE_API_URL || "/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Crucial for HTTP-only JWT cookies across domains
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error?.message ||
      err.message ||
      "Request failed";
    return Promise.reject({
      status: err.response?.status,
      message,
      details: err.response?.data?.error?.details,
      original: err,
    });
  }
);


