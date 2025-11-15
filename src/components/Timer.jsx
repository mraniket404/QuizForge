import React, { useEffect, useState } from "react";

export default function Timer({ seconds=600, onExpire, running=true }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) { onExpire && onExpire(); return; }
    const id = setInterval(() => setTime(t => t-1), 1000);
    return () => clearInterval(id);
  }, [time, running]);

  const mm = String(Math.floor(time/60)).padStart(2,"0");
  const ss = String(time%60).padStart(2,"0");
  return (
    <div className="inline-flex items-center gap-3 px-3 py-2 bg-white/6 rounded">
      <svg className="w-5 h-5 text-orange-300" viewBox="0 0 24 24" fill="none"><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <div className="font-semibold">{mm}:{ss}</div>
    </div>
  );
}
