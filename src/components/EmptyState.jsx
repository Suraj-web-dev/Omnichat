import React from 'react';
import { Sparkles, MessageSquare, Trophy, Zap, Cpu, ArrowRight } from 'lucide-react';
import { AVAILABLE_MODELS, QUICK_PROMPTS } from '../data/dummyData';

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 px-4 text-center max-w-3xl mx-auto">
      {/* Central Hero Badge */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-600/30 ring-4 ring-indigo-500/20">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
        Ask Once. Compare 3 Models. Pick the Best.
      </h2>
      <p className="text-sm text-slate-400 max-w-lg mb-8 leading-relaxed">
        Type any question to run <strong className="text-emerald-400">GPT-4o</strong>, <strong className="text-amber-400">Claude 3.5</strong>, and <strong className="text-blue-400">Gemini 1.5</strong> in parallel. Review outputs side-by-side and choose your preferred answer.
      </p>

      {/* 3 Model Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
        {AVAILABLE_MODELS.map(model => (
          <div
            key={model.id}
            className="p-3.5 rounded-xl bg-[#141824] border border-slate-800 text-left flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${model.avatarBg}`}>
                {model.name.charAt(0)}
              </span>
              <span className="font-bold text-xs text-white">{model.name}</span>
            </div>
            <p className="text-[11px] text-slate-400">{model.tagline}</p>
          </div>
        ))}
      </div>

      {/* Suggested Starter Prompts */}
      <div className="w-full text-left space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Select a starter prompt to test:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-xs group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-indigo-300 group-hover:text-indigo-200">
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 line-clamp-2 group-hover:text-slate-300">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

