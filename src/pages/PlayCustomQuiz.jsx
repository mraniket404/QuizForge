import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import QuestionCard from "../components/QuestionCard";

export default function PlayCustomQuiz(){
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
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
      }
    }
    load();
  },[id]);

  const onSelect = (i,opt) => setAnswers(prev=>{ const c=[...prev]; c[i]=opt; return c; });

  const submit = async () => {
    try {
      setSubmitting(true);
      const res = await api.post(`/customquiz/${id}/submit`, { answers });
      
      console.log("Submit response:", res);
      
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

  if (!quiz) return <div className="glass p-6 rounded">Loading...</div>;

  const allAnswered = answers.every(answer => answer !== null);
  const answeredCount = answers.filter(answer => answer !== null).length;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">{quiz.title}</h2>
      <div className="mb-4 small-muted">
        Answered: {answeredCount} / {quiz.questions.length}
      </div>
      <div className="glass p-6 rounded-xl">
        {quiz.questions.map((q,i)=>(
          <QuestionCard key={i} index={i} q={q} selected={answers[i]} onSelect={onSelect} />
        ))}
        <div className="flex justify-between items-center mt-4">
          <div className="small-muted">
            {allAnswered ? "All questions answered!" : "Please answer all questions"}
          </div>
          <button 
            className="btn-grad px-4 py-2 rounded disabled:opacity-50" 
            onClick={submit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}