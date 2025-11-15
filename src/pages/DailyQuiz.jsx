import React, { useEffect, useState } from "react";
import api from "../utils/api";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";

export default function DailyQuiz(){
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // default 10 min
  const nav = useNavigate();

  useEffect(()=>{
    async function load(){
      try {
        const q = await api.get("/dailyquiz/today");
        setQuiz(q);
        setAnswers(new Array(q.questions.length).fill(null));
      } catch(e){
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

  const onExpire = () => submit(); // auto submit

  const submit = async () => {
    if (!quiz) return;
    const payload = { quizId: quiz._id, answers, type:"daily" };
    try {
      const res = await api.post("/dailyquiz/submit", payload);
      const attemptId = res.attemptId || res._id || res.id;
      nav(`/result/${attemptId}`);
    } catch(err){
      alert("Submit failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!quiz) return <div className="glass p-6 rounded">No daily quiz available.</div>;

  const answeredCount = answers.filter(a=>a!==null).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Daily Quiz</h2>
        <div className="flex items-center gap-3">
          <div className="small-muted">Progress</div>
          <div className="w-44 h-3 bg-white/6 rounded overflow-hidden">
            <div style={{width:`${progress}%`}} className="h-full bg-gradient-to-r from-green-400 to-cyan-400"></div>
          </div>
          <Timer seconds={600} onExpire={onExpire} />
        </div>
      </div>

      <div className="glass p-6 rounded-xl">
        {quiz.questions.map((q,i)=>(
          <QuestionCard key={i} index={i} q={q} selected={answers[i]} onSelect={onSelect}/>
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={submit} className="btn-grad px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
