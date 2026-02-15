import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use a request interceptor to inject the token dynamically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token"); // Double check this key name!
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Axios Interceptor: Token attached to request");
      } else {
        console.warn("Axios Interceptor: No token found in localStorage");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;