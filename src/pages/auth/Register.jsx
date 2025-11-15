import React, { useState, useContext, useEffect } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){
  const { login, user } = useContext(AuthContext);
  const nav = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");
      const res = await api.post("/auth/register", { name, email, password });
      login(res.token, res.user);
      nav("/");
    } catch(error) {
      setErr(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't show register page if already logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background Section - FIXED */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/login.avif')`
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float z-0"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float z-0" style={{animationDelay: '2s'}}></div>

      {/* Form Content */}
      <div className="max-w-md w-full mx-auto z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-2">
              Join QuizForge
            </h1>
            <p className="text-white/80">Start your learning adventure today</p>
          </div>

          {/* Error Message */}
          {err && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-400 mb-6 flex items-center gap-3 backdrop-blur-sm">
              <span className="text-lg">⚠️</span>
              <div className="flex-1">
                <div className="font-semibold">Registration Failed</div>
                <div className="text-sm text-red-300/80">{err}</div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Full Name</label>
                <input 
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  placeholder="Enter your full name" 
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-green-400/50 focus:bg-white/20 transition-all duration-300 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/30 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Email Address</label>
                <input 
                  value={email} 
                  onChange={e=>setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  type="email"
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-cyan-400/50 focus:bg-white/20 transition-all duration-300 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Password</label>
                <input 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                  placeholder="Create a strong password" 
                  type="password" 
                  className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 focus:border-purple-400/50 focus:bg-white/20 transition-all duration-300 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 backdrop-blur-sm"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-green-500/25"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>🎉</span>
                  Start Learning Free
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}