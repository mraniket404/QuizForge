import React from "react";

export default function QuestionCard({ index, q, selected, onSelect }) {
  return (
    <div className="bg-white/6 p-4 rounded-xl mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Q{index+1}. {q.question}</div>
        <div className="text-sm small-muted">Points: 1</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(index, i)}
            className={`text-left p-3 rounded-lg border ${selected===i ? "border-cyan-400 bg-white/8" : "border-transparent hover:bg-white/3"}`}
          >
            <div className="font-medium">{String.fromCharCode(65+i)}. {opt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
