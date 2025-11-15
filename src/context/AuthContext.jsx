import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quizforge_user")); } catch { return null; }
  });

  useEffect(() => {
    const token = localStorage.getItem("quizforge_token");
    if (token) api.setToken(token);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("quizforge_user", JSON.stringify(user));
    else localStorage.removeItem("quizforge_user");
  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem("quizforge_token", token);
    api.setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("quizforge_token");
    api.removeToken();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
}
