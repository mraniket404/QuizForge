import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function BrowseQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        const res = await api.get("/customquiz/all");
        setQuizzes(res);
      } catch (e) {
        console.error("Failed to load quizzes:", e);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    }
    loadQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-center">
            Community Quizzes
          </h1>
          <p className="text-white/70 text-center mt-2">
            Explore and play quizzes created by the community
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold mb-4">No Quizzes Yet</h3>
            <p className="text-white/70 mb-6">Be the first to create an amazing quiz!</p>
            <Link 
              to="/create"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 inline-block"
            >
              Create First Quiz
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <Link 
                key={quiz._id} 
                to={`/play-custom/${quiz._id}`}
                className="group glass p-6 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{quiz.title}</h3>
                <p className="text-white/70 mb-4 flex items-center gap-2">
                  <span>❓</span>
                  {quiz.questions?.length || 0} questions
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Play Now →
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {quiz.questions?.length || 0}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}