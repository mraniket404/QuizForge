import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({ baseURL: API_URL });

// Add request interceptor to include token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("quizforge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage
      localStorage.removeItem("quizforge_token");
      localStorage.removeItem("quizforge_user");
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default {
  get: (url) => instance.get(url).then(r => r.data),
  post: (url, data) => instance.post(url, data).then(r => r.data),
  put: (url, data) => instance.put(url, data).then(r => r.data),
  del: (url) => instance.delete(url).then(r => r.data),
  setToken: (token) => { 
    localStorage.setItem("quizforge_token", token);
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`; 
  },
  removeToken: () => { 
    localStorage.removeItem("quizforge_token");
    localStorage.removeItem("quizforge_user");
    delete instance.defaults.headers.common["Authorization"]; 
  }
};