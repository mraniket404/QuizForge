import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Profile(){
  const [profile, setProfile] = useState(null);

  useEffect(()=>{
    async function load(){
      try { const res = await api.get("/user/profile"); setProfile(res); } catch(e){}
    }
    load();
  },[]);

  if (!profile) return <div className="glass p-6 rounded">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      <div className="glass p-6 rounded">
        <h3 className="font-semibold text-lg">Account</h3>
        <div className="mt-3">Name: {profile.name}</div>
        <div>Email: {profile.email}</div>
        <div className="mt-3">Streak: <span className="font-bold">{profile.streak}</span></div>
      </div>

      <div className="glass p-6 rounded">
        <h3 className="font-semibold text-lg">Attempts</h3>
        <div className="mt-3 space-y-2">
          {profile.attempts && profile.attempts.length ? profile.attempts.map(a=>(
            <div key={a._id} className="p-2 bg-white/6 rounded flex justify-between">
              <div>{a.type}</div>
              <div>{a.score}</div>
            </div>
          )) : <div className="small-muted">No attempts yet</div>}
        </div>
      </div>
    </div>
  );
}
