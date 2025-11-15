import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({ baseURL: API_URL });

export default {
  get: (url) => instance.get(url).then(r => r.data),
  post: (url, data) => instance.post(url, data).then(r => r.data),
  put: (url, data) => instance.put(url, data).then(r => r.data),
  del: (url) => instance.delete(url).then(r => r.data),
  setToken: (token) => { instance.defaults.headers.common["Authorization"] = `Bearer ${token}`; },
  removeToken: () => { delete instance.defaults.headers.common["Authorization"]; }
};
