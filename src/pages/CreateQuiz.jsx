import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz(){
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question:"", options:["",""], answer:0 }]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const addQuestion = () => setQuestions(prev => [...prev, { question:"", options:["",""], answer:0 }]);
  const updateQ = (idx, field, val) => setQuestions(prev => { const c=[...prev]; c[idx][field]=val; return c;});
  const updateOption = (qIdx, oIdx, val) => setQuestions(prev => { const c=[...prev]; c[qIdx].options[oIdx]=val; return c; });
  const addOption = (qIdx) => setQuestions(prev => { const c=[...prev]; c[qIdx].options.push(""); return c; });
  const removeOption = (qIdx, oIdx) => {
    if (questions[qIdx].options.length > 2) {
      setQuestions(prev => {
        const c = [...prev];
        c[qIdx].options = c[qIdx].options.filter((_, idx) => idx !== oIdx);
        if (c[qIdx].answer >= oIdx) {
          c[qIdx].answer = Math.max(0, c[qIdx].answer - 1);
        }
        return c;
      });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { title, questions };
      const res = await api.post("/customquiz/create", payload);
      
      const quizId = res.quizId || res._id || res.id;
      
      if (!quizId) {
        console.error("No quiz ID found in response:", res);
        alert("Failed to create quiz - no ID returned");
        return;
      }
      
      nav(`/play/${quizId}`);
    } catch (e) {
      console.error("Create failed:", e);
      alert("Create failed: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative my-14">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4">
            Create Your Quiz
          </h1>
          <p className="text-white/70 text-lg">Craft amazing quizzes and challenge your friends</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 backdrop-blur-sm shadow-2xl">
          <form onSubmit={submit} className="space-y-6">
            {/* Quiz Title */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-white/90">Quiz Title</label>
              <input 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                placeholder="Enter an engaging quiz title..." 
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                required 
              />
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, i)=>(
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {i+1}
                      </div>
                      <h3 className="text-lg font-semibold">Question {i+1}</h3>
                    </div>
                    <div className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                      Select correct answer
                    </div>
                  </div>
                  
                  <input 
                    value={q.question} 
                    onChange={e=>updateQ(i,'question',e.target.value)} 
                    placeholder="Enter your question here..." 
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 text-white placeholder-white/40 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                  />

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((opt, j)=>(
                      <div key={j} className="flex gap-3 items-center group">
                        <div className="flex-1 flex gap-3 items-center">
                          <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-white/70 bg-white/10 rounded-lg">
                            {String.fromCharCode(65 + j)}
                          </div>
                          <input 
                            value={opt} 
                            onChange={e=>updateOption(i,j,e.target.value)} 
                            placeholder={`Option ${j+1}`} 
                            className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-400/50 focus:bg-white/10 transition-all duration-300 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400/30"
                          />
                        </div>
                        <div className="flex gap-2 items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              q.answer === j 
                                ? 'border-green-400 bg-green-400/20' 
                                : 'border-white/30 hover:border-white/50'
                            }`}>
                              {q.answer === j && <div className="w-3 h-3 bg-green-400 rounded-full"></div>}
                            </div>
                            <input 
                              type="radio" 
                              checked={q.answer===j} 
                              onChange={()=>updateQ(i,'answer',j)} 
                              className="hidden" 
                            />
                          </label>
                          {q.options.length > 2 && (
                            <button 
                              type="button" 
                              onClick={()=>removeOption(i,j)}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      type="button" 
                      onClick={()=>addOption(i)} 
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                      <span>+</span>
                      Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button 
                type="button" 
                onClick={addQuestion} 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>+</span>
                Add Question
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Publish Quiz
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}