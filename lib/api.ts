import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "https://medingen.in/api/";

// Isomorphic helper to retrieve jwt_token
export const getAuthToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    return Cookies.get("jwt_token");
  }
  // Server-side will require parsing headers or passing directly
  return undefined;
};

// Create basic Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle unauthorized/invalid token states
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const message = error.response.data?.message || error.response.data?.error || "";
      if (message === "Token is invalid" || message === "Invalid token") {
        if (typeof window !== "undefined") {
          // Clear all cookies client-side
          Cookies.remove("jwt_token");
          Cookies.remove("customer_id");
          Cookies.remove("customer_name");
          Cookies.remove("email");
          Cookies.remove("location");
          localStorage.clear();
          sessionStorage.clear();
          
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Method to get authorized headers (isomorphic helper)
export const getAuthHeaders = (serverToken?: string) => {
  const token = serverToken || getAuthToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};
