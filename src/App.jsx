import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DailyQuiz from "./pages/DailyQuiz";
import CreateQuiz from "./pages/CreateQuiz";
import BrowseQuizzes from "./pages/BrowseQuizzes";
import PlayCustomQuiz from "./pages/PlayCustomQuiz";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

export default function App(){
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading QuizForge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-black">
      <Navbar />
      <main className="container mx-auto p-4 pt-20">
        <Routes>
          {/* Public routes - redirect to home if already logged in */}
          <Route 
            path="/login" 
            element={!user ? <Login/> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register/> : <Navigate to="/" replace />} 
          />
          
          {/* Protected routes - redirect to login if not logged in */}
          <Route 
            path="/" 
            element={user ? <Home/> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/daily" 
            element={user ? <DailyQuiz/> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/create" 
            element={user ? <CreateQuiz/> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile/> : <Navigate to="/login" replace />} 
          />
          
          {/* Semi-protected routes - can browse but need login for some actions */}
          <Route path="/browse" element={<BrowseQuizzes/>} />
          <Route path="/play-custom/:id" element={<PlayCustomQuiz/>} />
          <Route path="/play/:id" element={<PlayCustomQuiz/>} />
          <Route path="/result/:attemptId" element={<Result/>} />
          
          {/* Catch all route - redirect based on auth status */}
          <Route 
            path="*" 
            element={<Navigate to={user ? "/" : "/login"} replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}