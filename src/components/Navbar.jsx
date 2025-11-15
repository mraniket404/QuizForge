import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <header className="py-4 shadow-sm glass">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold">QF</div>
          <div>
            <div className="text-lg font-bold">QuizForge</div>
            <div className="text-xs small-muted">Daily Streak & Custom Quizzes</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/" className="px-3 py-2 hover:bg-white/5 rounded">Home</Link>
          <Link to="/daily" className="px-3 py-2 hover:bg-white/5 rounded">Daily</Link>
          <Link to="/create" className="px-3 py-2 hover:bg-white/5 rounded">Create</Link>
          {user ? (
            <>
              <Link to="/profile" className="px-3 py-2 hover:bg-white/5 rounded">Profile</Link>
              <button onClick={handleLogout} className="px-3 py-2 btn-grad rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2">Login</Link>
              <Link to="/register" className="px-3 py-2 btn-grad rounded">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
