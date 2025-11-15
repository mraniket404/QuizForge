import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { 
      return JSON.parse(localStorage.getItem("quizforge_user")); 
    } catch { 
      return null; 
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("quizforge_token");
    const userData = localStorage.getItem("quizforge_user");
    
    if (token && userData) {
      api.setToken(token);
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("quizforge_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("quizforge_user");
    }
  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem("quizforge_token", token);
    api.setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("quizforge_token");
    localStorage.removeItem("quizforge_user");
    api.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}