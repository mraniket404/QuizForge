import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import QuestionCard from "../components/QuestionCard";

export default function PlayCustomQuiz(){
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(()=>{
    async function load(){
      try {
        const res = await api.get(`/customquiz/${id}`);
        setQuiz(res);
        setAnswers(new Array(res.questions.length).fill(null));
      } catch(e){
        console.error("Failed to load quiz:", e);
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[id]);

  const onSelect = (i,opt) => setAnswers(prev=>{ const c=[...prev]; c[i]=opt; return c; });

  const submit = async () => {
    try {
      setSubmitting(true);
      const res = await api.post(`/customquiz/${id}/submit`, { answers });
      
      // Create a temporary attempt object for results
      const attemptData = {
        _id: `custom_${Date.now()}`,
        score: res.score,
        total: res.total,
        answers: answers,
        questions: quiz.questions,
        date: new Date(),
        type: "custom"
      };
      
      // Navigate to results with the attempt data
      nav(`/result/${attemptData._id}`, { state: { attempt: attemptData } });
    } catch(e){
      console.error("Submit failed:", e);
      alert("Submit failed: " + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading quiz...</p>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-3xl text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-2xl font-bold mb-2">Quiz Not Found</h3>
        <p className="text-white/70 mb-4">This quiz doesn't exist or has been removed</p>
        <button 
          onClick={() => nav("/")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  const allAnswered = answers.every(answer => answer !== null);
  const answeredCount = answers.filter(answer => answer !== null).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
              <p className="text-white/70 mt-1">Custom quiz created by community</p>
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

              <div className="text-center">
                <div className="text-sm text-white/60 mb-2">Status</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  allAnswered 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {allAnswered ? 'Ready to submit' : 'In progress'}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  <span>📤</span>
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