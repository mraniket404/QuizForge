import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.token, res.user);
      nav("/");
    } catch(error) {
      setErr(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl font-bold mb-3">Login</h2>
      {err && <div className="text-red-400 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded bg-white/6" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded bg-white/6 text-black" required />
        <button className="btn-grad w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
}
