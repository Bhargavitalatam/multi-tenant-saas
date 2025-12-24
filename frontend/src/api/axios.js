import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
