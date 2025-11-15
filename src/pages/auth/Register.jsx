import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password });
      login(res.token, res.user);
      nav("/");
    } catch(error) {
      setErr(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto glass p-6 rounded">
      <h2 className="text-xl font-bold mb-3">Create account</h2>
      {err && <div className="text-red-400 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded bg-white/6 text-black" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded bg-white/6 text-black" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded bg-white/6 text-black" required />
        <button className="btn-grad w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
}
