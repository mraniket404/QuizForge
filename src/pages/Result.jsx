import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function Result(){
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.attempt) {
      setAttempt(location.state.attempt);
      setLoading(false);
      return;
    }

    async function load(){
      try {
        setLoading(true);
        
        if (!attemptId || attemptId === 'undefined' || attemptId === 'null') {
          setLoading(false);
          return;
        }

        const res = await api.get(`/attempts/${attemptId}`);
        if (res && res._id) {
          setAttempt(res);
        }
      } catch (e) { 
        console.error("Failed to load attempt:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attemptId, location.state]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading your results...</p>
      </div>
    </div>
  );
  
  if (!attempt) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-3xl text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-2xl font-bold mb-2">Results Not Found</h3>
        <p className="text-white/70 mb-4">We couldn't find your quiz results</p>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  const percentage = Math.round((attempt.score / attempt.total) * 100);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;
  const isAverage = percentage >= 50;

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className="glass p-8 rounded-3xl border border-white/10 backdrop-blur-sm text-center mb-8">
          <div className={`text-6xl mb-4 ${
            isExcellent ? 'text-yellow-400' :
            isGood ? 'text-green-400' :
            isAverage ? 'text-blue-400' : 'text-red-400'
          }`}>
            {isExcellent ? '🏆' : isGood ? '🎉' : isAverage ? '👍' : '💪'}
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
            Quiz Completed!
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">{attempt.score}/{attempt.total}</div>
              <div className="text-white/60 text-sm">Score</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">{percentage}%</div>
              <div className="text-white/60 text-sm">Percentage</div>
            </div>
            
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-sm text-white mb-1">
                {new Date(attempt.date).toLocaleDateString()}
              </div>
              <div className="text-white/60 text-sm">Completed</div>
            </div>
          </div>

          <div className={`text-lg font-semibold px-4 py-2 rounded-full inline-block ${
            isExcellent ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            isGood ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            isAverage ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isExcellent ? 'Outstanding Performance! 🎊' :
             isGood ? 'Great Job! 👏' :
             isAverage ? 'Good Effort! 💪' : 'Keep Practicing! 📚'}
          </div>
        </div>

        {/* Question Review */}
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Question Review
          </h2>

          <div className="space-y-4">
            {attempt.questions?.map((q, i) => {
              const isCorrect = attempt.answers[i] === q.answer;
              return (
                <div key={i} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isCorrect 
                    ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50' 
                    : 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3">{q.question}</h3>
                      
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              optIndex === q.answer 
                                ? 'bg-green-500/20 border-green-500 text-green-100' 
                                : optIndex === attempt.answers[i]
                                ? 'bg-red-500/20 border-red-500 text-red-100'
                                : 'bg-white/5 border-white/10 text-white/70'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                  optIndex === q.answer 
                                    ? 'bg-green-500 text-white' 
                                    : optIndex === attempt.answers[i]
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/10 text-white/60'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span>{option}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                {optIndex === q.answer && (
                                  <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                                    ✓ Correct
                                  </span>
                                )}
                                {optIndex === attempt.answers[i] && !isCorrect && (
                                  <span className="text-red-400 text-sm font-semibold flex items-center gap-1">
                                    ✗ Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          <div className="text-blue-400 font-semibold mb-1">💡 Explanation</div>
                          <div className="text-white/80 text-sm">{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm mt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              🏠 Back to Home
            </button>
            
            {attempt.type === "custom" && (
              <button 
                onClick={() => navigate("/create")}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                ✨ Create Another Quiz
              </button>
            )}
            
            <button 
              onClick={() => navigate("/daily")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 justify-center"
            >
              🔥 Try Daily Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}