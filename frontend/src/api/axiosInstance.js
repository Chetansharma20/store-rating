import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // If the response contains our standard envelope, unwrap the nested data
    if (response.data && response.data.success !== undefined && response.data.hasOwnProperty('data')) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // For error responses containing our envelope, map message to error field
    if (error.response?.data && error.response.data.success === false && error.response.data.message) {
      error.response.data.error = error.response.data.message;
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
