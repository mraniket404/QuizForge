import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Home(){
  const { user } = useContext(AuthContext);
  const [streak, setStreak] = useState(user?.streak || 0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(){
      try {
        // Load leaderboard (public endpoint)
        try {
          const lb = await api.get("/user/leaderboard");
          setLeaderboard(lb.slice(0,5));
        } catch (lbError) {
          console.log("Leaderboard not available");
          setLeaderboard([]);
        }

        // Don't try to load profile - let the AuthContext handle user state
        // The 401 will be handled by the API interceptor
        
      } catch(e){
        console.log("Home load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // Remove user dependency to avoid loops

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/70 text-lg">Preparing Your Learning Journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            QuizForge
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
            Where <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text font-semibold">knowledge meets fun</span>
          </p>
        </div>

        {/* Stats & Main Actions */}
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
            <Link 
              to={user ? "/daily" : "/login"} 
              className="group relative bg-gradient-to-br from-blue-600/15 to-purple-600/15 p-8 rounded-3xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">Daily Challenge</div>
                    <div className="text-sm text-white/60 font-medium">Fresh questions every 24h</div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 text-lg leading-relaxed font-light">
                  Test your skills with today's handpicked questions
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                    🎯 10 questions
                  </span>
                  {user ? (
                    <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-all duration-300">
                      Start Quiz
                    </button>
                  ) : (
                    <button className="px-8 py-3 border-2 border-white/30 rounded-xl font-bold backdrop-blur-sm group-hover:bg-white/10 transition-all duration-300">
                      Login to Play
                    </button>
                  )}
                </div>
              </div>
            </Link>

            <Link 
              to="/create" 
              className="group relative bg-gradient-to-br from-green-600/15 to-cyan-600/15 p-8 rounded-3xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-300 to-cyan-400 bg-clip-text text-transparent">Create Quiz</div>
                    <div className="text-sm text-white/60 font-medium">Unleash your creativity</div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 text-lg leading-relaxed font-light">
                  Design custom quizzes with your unique questions
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                    🌟 Unlimited
                  </span>
                  <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-bold shadow-lg shadow-green-500/30 group-hover:scale-105 transition-all duration-300">
                    Create Now
                  </button>
                </div>
              </div>
            </Link>
          </div>

          {/* Streak & Leaderboard Sidebar */}
          <div className="space-y-6">
            {/* Streak Card */}
            {user && (
              <div className="relative bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-6 rounded-3xl border border-yellow-500/30 text-center backdrop-blur-sm">
                <div className="text-sm text-white/70 mb-4 font-medium">
                  CURRENT STREAK
                </div>
                
                <div className="text-6xl font-black bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  {streak}
                </div>
                
                <div className="text-sm font-semibold text-yellow-300/90 mt-4">
                  {streak > 5 ? "FIRE STREAK! 🔥" : streak > 0 ? "Keep burning! 🔥" : "Start your journey!"}
                </div>
              </div>
            )}

            {/* Leaderboard Card */}
            <div className="bg-gradient-to-br from-purple-600/15 to-pink-600/15 p-6 rounded-3xl border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-lg">🏆</span>
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">Top Players</div>
                  <div className="text-sm text-white/60 font-medium">Global rankings</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {leaderboard.length ? leaderboard.map((u, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-4 rounded-2xl backdrop-blur-sm border ${
                      i === 0 ? 'bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border-yellow-500/30' :
                      i === 1 ? 'bg-gradient-to-r from-gray-400/15 to-gray-500/15 border-gray-400/30' :
                      i === 2 ? 'bg-gradient-to-r from-orange-700/15 to-red-700/15 border-orange-700/30' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-black ${
                        i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                        i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                        i === 2 ? 'bg-gradient-to-br from-orange-600 to-red-700 text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="font-semibold text-white/90 truncate max-w-[100px]">{u.name}</div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-white">
                      {u.streak}
                      <span className="text-orange-400 text-lg">🔥</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-white/50">
                    <div className="text-3xl mb-3">📊</div>
                    <div className="text-sm font-medium mb-1">No rankings yet</div>
                    <div className="text-xs">Be the first to make history!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        {!user ? (
          <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-10 rounded-3xl border border-blue-500/20 text-center backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto text-lg leading-relaxed font-light">
              Join our community of learners and track your progress
            </p>
            <div className="flex gap-6 justify-center items-center">
              <Link 
                to="/register" 
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all duration-300"
              >
                🚀 Start Learning Free
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-4 border-2 border-white/30 rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                🔑 Existing Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-green-600/10 to-cyan-600/10 p-8 rounded-3xl border border-green-500/20 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-300 to-cyan-400 bg-clip-text text-transparent">
              Welcome back, {user.name || user.username}! 👋
            </h3>
            <p className="text-white/70 text-lg font-light">
              Continue your learning adventure today!
            </p>
          </div>
        )}
      </div>

      {/* Add CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}