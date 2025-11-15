import React, { useEffect, useState } from "react";
import api from "../utils/api";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";

export default function DailyQuiz(){
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(()=>{
    async function load(){
      try {
        const q = await api.get("/dailyquiz/today");
        setQuiz(q);
        setAnswers(new Array(q.questions.length).fill(null));
      } catch(e){
        console.error("Failed to load quiz:", e);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[]);

  const onSelect = (i, opt) => {
    setAnswers(prev => { const c = [...prev]; c[i]=opt; return c; });
  };

  const onExpire = () => {
    if (!submitting) {
      submit();
    }
  };

  const submit = async () => {
    if (!quiz || submitting) return;
    
    try {
      setSubmitting(true);
      setError("");
      
      const payload = { 
        quizId: quiz._id, 
        answers, 
        type: "daily" 
      };
      
      console.log("📤 Submitting quiz:", payload);
      
      const res = await api.post("/dailyquiz/submit", payload);
      console.log("✅ Submit response:", res);
      
      const attemptId = res.attemptId;
      
      if (attemptId) {
        nav(`/result/${attemptId}`);
      } else {
        throw new Error("No attempt ID returned from server");
      }
      
    } catch(err) {
      console.error("💥 Submit failed:", err);
      console.error("📋 Error details:", err.response?.data);
      
      setError("Failed to submit quiz: " + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading today's challenge...</p>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-3xl text-center max-w-md">
        <div className="text-6xl mb-4">😴</div>
        <h3 className="text-2xl font-bold mb-2">No Quiz Today</h3>
        <p className="text-white/70">Check back tomorrow for a new challenge!</p>
      </div>
    </div>
  );

  const answeredCount = answers.filter(a=>a!==null).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);
  const allAnswered = answeredCount === quiz.questions.length;

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Daily Challenge
              </h1>
              <p className="text-white/70 mt-1">Test your skills with today's curated questions</p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Progress */}
              <div className="text-center">
                <div className="text-sm text-white/60 mb-2">Progress</div>
                <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    style={{width:`${progress}%`}} 
                    className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all duration-500"
                  ></div>
                </div>
                <div className="text-xs text-white/60 mt-1">{answeredCount}/{quiz.questions.length}</div>
              </div>

              {/* Timer */}
              <div className="text-center">
                <div className="text-sm text-white/60 mb-2">Time Left</div>
                <Timer seconds={600} onExpire={onExpire} />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass p-4 rounded-2xl border border-red-500/30 bg-red-500/10 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div>
                <div className="text-red-400 font-semibold">Submission Error</div>
                <div className="text-red-300/80 text-sm">{error}</div>
              </div>
              <button 
                onClick={() => setError("")}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          {quiz.questions.map((q,i)=>(
            <QuestionCard key={i} index={i} q={q} selected={answers[i]} onSelect={onSelect}/>
          ))}
        </div>

        {/* Submit Button */}
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm mt-6">
          <div className="flex justify-between items-center">
            <div className="text-white/70">
              {allAnswered ? (
                <span className="text-green-400 flex items-center gap-2">
                  <span>✅</span> All questions answered! Ready to submit
                </span>
              ) : (
                `${quiz.questions.length - answeredCount} questions remaining`
              )}
            </div>
            <button 
              onClick={submit} 
              disabled={!allAnswered || submitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Submit Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}