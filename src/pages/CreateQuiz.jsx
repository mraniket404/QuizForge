import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz(){
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question:"", options:["",""], answer:0 }]);
  const nav = useNavigate();

  const addQuestion = () => setQuestions(prev => [...prev, { question:"", options:["",""], answer:0 }]);
  const updateQ = (idx, field, val) => setQuestions(prev => { const c=[...prev]; c[idx][field]=val; return c;});
  const updateOption = (qIdx, oIdx, val) => setQuestions(prev => { const c=[...prev]; c[qIdx].options[oIdx]=val; return c; });
  const addOption = (qIdx) => setQuestions(prev => { const c=[...prev]; c[qIdx].options.push(""); return c; });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, questions };
      const res = await api.post("/customquiz/create", payload);
      
      console.log("API Response:", res); // res is already the data!
      
      // FIX: res is already the data object, no need for res.data
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
      <form onSubmit={submit} className="space-y-4 text-black">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Quiz Title" className="w-full p-3 rounded bg-white/6" required />

        {questions.map((q, i)=>(
          <div key={i} className="p-4 bg-white/4 rounded">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Question {i+1}</div>
              <div className="text-sm small-muted">Answer choice</div>
            </div>
            <input value={q.question} onChange={e=>updateQ(i,'question',e.target.value)} placeholder="Question text" className="w-full p-2 rounded bg-white/6 mb-3"/>

            {q.options.map((opt, j)=>(
              <div key={j} className="flex gap-2 items-center mb-2">
                <input value={opt} onChange={e=>updateOption(i,j,e.target.value)} placeholder={`Option ${j+1}`} className="flex-1 p-2 rounded bg-white/6"/>
                <label className="small-muted">Ans
                  <input type="radio" checked={q.answer===j} onChange={()=>updateQ(i,'answer',j)} className="ml-2" />
                </label>
              </div>
            ))}

            <div>
              <button type="button" onClick={()=>addOption(i)} className="px-3 py-1 border rounded small-muted">Add option</button>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addQuestion} className="px-4 py-2 border rounded">+ Add Question</button>
          <button type="submit" className="btn-grad px-4 py-2 rounded">Publish</button>
        </div>
      </form>
    </div>
  );
}