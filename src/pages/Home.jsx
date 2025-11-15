import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Home(){
  const { user } = useContext(AuthContext);
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
      } catch(e){
        console.log("Home load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

      {/* Main Content with Navbar Spacing */}
      <div className="relative z-10 pt-24 pb-8 px-4">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            QuizForge
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
            Where <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text font-semibold">knowledge meets fun</span>
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {/* Daily Challenge Card */}
            <Link 
              to="/daily" 
              className="group relative bg-gradient-to-br from-blue-600/15 to-purple-600/15 p-6 rounded-3xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-red-400 bg-clip-text text-transparent">
                      Daily Challenge
                    </div>
                    <div className="text-sm text-white/60 font-medium">
                      Fresh questions every 24h
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 text-lg leading-relaxed font-light">
                  Test your skills with today's handpicked questions
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                    🎯 10 questions
                  </span>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-all duration-300">
                    Start Quiz
                  </button>
                </div>
              </div>
            </Link>

            {/* Create Quiz Card */}
            <Link 
              to="/create" 
              className="group relative bg-gradient-to-br from-green-600/15 to-cyan-600/15 p-6 rounded-3xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-300 to-cyan-400 bg-clip-text text-transparent">
                      Create Quiz
                    </div>
                    <div className="text-sm text-white/60 font-medium">
                      Unleash your creativity
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 text-lg leading-relaxed font-light">
                  Design custom quizzes with your unique questions
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                    🌟 Unlimited
                  </span>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-bold shadow-lg shadow-green-500/30 group-hover:scale-105 transition-all duration-300">
                    Create Now
                  </button>
                </div>
              </div>
            </Link>

            {/* Browse Quizzes Card */}
            <Link 
              to="/browse" 
              className="group relative bg-gradient-to-br from-purple-600/15 to-pink-600/15 p-6 rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-2xl">🌎</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                      Browse Quizzes
                    </div>
                    <div className="text-sm text-white/60 font-medium">
                      Play community quizzes
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6 text-lg leading-relaxed font-light">
                  Explore and play quizzes created by other users
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                    👥 Community
                  </span>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-all duration-300">
                    Browse Now
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="flex justify-center mb-12">
          <div className="max-w-4xl w-full">
            <div className="bg-gradient-to-br from-purple-600/15 to-pink-600/15 p-8 rounded-3xl border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-8 justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                    Top Players
                  </div>
                  <div className="text-base text-white/60 font-medium">
                    Global rankings
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {leaderboard.length ? leaderboard.map((u, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col items-center p-4 rounded-2xl backdrop-blur-sm border text-center ${
                      i === 0 ? 'bg-gradient-to-b from-yellow-500/15 to-orange-500/15 border-yellow-500/30' :
                      i === 1 ? 'bg-gradient-to-b from-gray-400/15 to-gray-500/15 border-gray-400/30' :
                      i === 2 ? 'bg-gradient-to-b from-orange-700/15 to-red-700/15 border-orange-700/30' :
                      'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black mb-3 ${
                      i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' :
                      i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                      i === 2 ? 'bg-gradient-to-br from-orange-600 to-red-700 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="font-semibold text-white/90 text-base mb-2 truncate w-full">
                      {u.name}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-white text-base">
                      {u.streak}
                      <span className="text-orange-400 text-lg">🔥</span>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-white/50">
                    <div className="text-4xl mb-4">📊</div>
                    <div className="text-lg font-medium mb-2">No rankings yet</div>
                    <div className="text-sm">Be the first to make history!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="flex justify-center">
          <div className="max-w-2xl w-full">
            <div className="relative bg-gradient-to-r from-green-600/10 to-cyan-600/10 p-6 rounded-3xl border border-green-500/20 text-center backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-300 to-cyan-400 bg-clip-text text-transparent">
                Welcome back, {user.name || user.username}! 👋
              </h3>
              <p className="text-white/70 text-lg font-light">
                Continue your learning adventure today!
              </p>
            </div>
          </div>
        </div>
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