import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Home(){
  const { user, setUser } = useContext(AuthContext);
  const [streak, setStreak] = useState(user?.streak || 0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    async function load(){
      try {
        setProfileLoading(true);
        
        // Only try to load profile if user exists (has token)
        if (user) {
          try {
            const profile = await api.get("/user/profile");
            setUser(prev => ({...prev, ...profile}));
            setStreak(profile.streak || 0);
          } catch (profileError) {
            // 401 is expected if token is invalid
            console.log("Profile load failed - likely logged out");
          }
        }

        // Try to load leaderboard (public endpoint)
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
        setProfileLoading(false);
      }
    }
    load();
  }, [user, setUser]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent text-white">Welcome to QuizForge</h1>
            <p className="small-muted">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent text-white">Welcome to QuizForge</h1>
          <p className="small-muted">Daily quiz, streaks & custom tests for students</p>
        </div>
        {user && (
          <div className="text-right">
            <div className="text-sm small-muted">Current Streak</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 text-transparent bg-clip-text">
              {profileLoading ? "..." : streak}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to={user ? "/daily" : "/login"} className="glass p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition">
          <div className="text-lg font-semibold">🔥 Today's Quiz</div>
          <div className="small-muted mt-2">10 questions • quick timer</div>
          <div className="mt-4">
            {user ? (
              <button className="btn-grad px-4 py-2 rounded">Take Quiz</button>
            ) : (
              <button className="px-4 py-2 rounded border border-white/6">Login to Play</button>
            )}
          </div>
        </Link>

        <Link to="/create" className="glass p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition">
          <div className="text-lg font-semibold">✍️ Create Quiz</div>
          <div className="small-muted mt-2">Make a custom quiz and share</div>
          <div className="mt-4"><button className="px-4 py-2 rounded border border-white/6">Create</button></div>
        </Link>

        <div className="glass p-6 rounded-2xl shadow-lg">
          <div className="text-lg font-semibold">🏆 Leaderboard</div>
          <div className="small-muted mt-2">Top streaks</div>
          <ul className="mt-4 space-y-2">
            {leaderboard.length ? leaderboard.map((u,i)=>(
              <li key={i} className="flex justify-between">
                <div className="truncate max-w-[120px]">{i+1}. {u.name}</div>
                <div className="font-semibold">{u.streak}🔥</div>
              </li>
            )) : <li className="small-muted">No data available</li>}
          </ul>
        </div>
      </div>

      {/* Login prompt for non-logged in users */}
      {!user && (
        <div className="glass p-6 rounded-2xl text-center">
          <p className="text-lg mb-4">Login to track your streak and compete on the leaderboard!</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-grad px-6 py-2 rounded">Login</Link>
            <Link to="/register" className="px-6 py-2 border border-white/30 rounded hover:bg-white/10">Register</Link>
          </div>
        </div>
      )}

      {/* Welcome message for logged in users */}
      {user && (
        <div className="glass p-6 rounded-2xl text-center">
          <p className="text-lg mb-2">Welcome back, {user.name || user.username}!</p>
          <p className="small-muted">Keep your streak going with today's quiz!</p>
        </div>
      )}
    </div>
  );
}