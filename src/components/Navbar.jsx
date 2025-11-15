import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); nav("/"); };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 shadow-sm glass border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold">QF</div>
          <div>
            <div className="text-lg font-bold">QuizForge</div>
            <div className="text-xs text-white/60">Daily Streak & Custom Quizzes</div>
          </div>
        </Link>

        {/* Streak Display in Navbar - Bigger Size */}
        {user && user.streak > 0 && (
          <div className="flex items-center gap-3 bg-orange-500/20 px-4 py-3 rounded-full border border-orange-500/30">
            <span className="text-2xl text-orange-400 animate-pulse">🔥</span>
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg">{user.streak}</span>
              <span className="text-orange-300 text-xs -mt-1">days</span>
            </div>
          </div>
        )}

        <nav className="flex items-center gap-3">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive("/") ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "hover:bg-white/5"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/daily" 
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive("/daily") ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "hover:bg-white/5"
            }`}
          >
            Daily
          </Link>
          <Link 
            to="/create" 
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive("/create") ? "bg-green-500/20 text-green-400 border border-green-500/30" : "hover:bg-white/5"
            }`}
          >
            Create
          </Link>
          <Link 
            to="/browse" 
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive("/browse") ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "hover:bg-white/5"
            }`}
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link 
                to="/profile" 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/profile") ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "hover:bg-white/5"
                }`}
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-all duration-200 font-semibold"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}