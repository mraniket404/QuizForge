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
    // Check if attempt was passed via state (for custom quizzes)
    if (location.state?.attempt) {
      setAttempt(location.state.attempt);
      setLoading(false);
      return;
    }

    // Otherwise try to load from API (for daily quizzes)
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

  if (loading) return <div className="glass p-6 rounded text-center">Loading result...</div>;
  
  if (!attempt) return (
    <div className="max-w-3xl mx-auto glass p-6 rounded text-center">
      <div className="text-red-500 mb-4">No result data found</div>
      <button 
        onClick={() => navigate("/")}
        className="btn-grad px-4 py-2 rounded"
      >
        Go Home
      </button>
    </div>
  );

  const percentage = Math.round((attempt.score / attempt.total) * 100);

  return (
    <div className="max-w-3xl mx-auto glass p-6 rounded">
      <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
      <div className="text-lg mb-2">Score: {attempt.score} / {attempt.total}</div>
      <div className="text-lg mb-4">Percentage: {percentage}%</div>
      <div className="small-muted mb-6">{new Date(attempt.date).toLocaleString()}</div>

      <div className="space-y-4">
        {attempt.questions?.map((q,i)=>(
          <div key={i} className={`p-4 rounded-lg ${
            attempt.answers[i] === q.answer ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
          }`}>
            <div className="font-semibold text-lg mb-2">Q{i+1}. {q.question}</div>
            
            <div className="space-y-2 mb-3">
              {q.options.map((option, optIndex) => (
                <div 
                  key={optIndex}
                  className={`p-2 rounded ${
                    optIndex === q.answer 
                      ? 'bg-green-500/30 border border-green-500' 
                      : optIndex === attempt.answers[i]
                      ? 'bg-red-500/30 border border-red-500'
                      : 'bg-white/10'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                  {optIndex === q.answer && <span className="ml-2 text-green-400">✓ Correct</span>}
                  {optIndex === attempt.answers[i] && optIndex !== q.answer && <span className="ml-2 text-red-400">✗ Your answer</span>}
                </div>
              ))}
            </div>

            {q.explanation && (
              <div className="mt-3 p-3 bg-blue-500/20 rounded">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={() => navigate("/")}
          className="btn-grad px-4 py-2 rounded"
        >
          Back to Home
        </button>
        {attempt.type === "custom" && (
          <button 
            onClick={() => navigate("/create")}
            className="px-4 py-2 border rounded"
          >
            Create Another Quiz
          </button>
        )}
      </div>
    </div>
  );
}