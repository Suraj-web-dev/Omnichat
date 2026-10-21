import React from 'react';
import { Bot, ArrowUpRight } from 'lucide-react';
import { AVAILABLE_MODELS, QUICK_PROMPTS } from '../data/dummyData';

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 text-center max-w-2xl mx-auto">
      {/* Minimal Icon */}
      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 mb-5 shadow-sm">
        <Bot className="w-6 h-6 text-zinc-300" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
        Ask Once. Compare 3 Models. Pick the Best.
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        Submit any question to execute 3 frontier AI models in parallel. Compare their reasoning side-by-side and lock in the winning answer.
      </p>

      {/* 3 Model Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mb-8">
        {AVAILABLE_MODELS.map(model => (
          <div
            key={model.id}
            className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-left hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-[10px] font-mono text-zinc-300">
                {model.name.charAt(0)}
              </span>
              <span className="font-medium text-xs text-zinc-200 truncate">{model.name}</span>
            </div>
            <p className="text-[11px] text-zinc-400 line-clamp-1">{model.tagline}</p>
          </div>
        ))}
      </div>

      {/* Starter Prompts */}
      <div className="w-full text-left space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 px-1">
          Suggested starter prompts
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="text-left p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-zinc-200 group-hover:text-white">
                  {item.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-zinc-400 line-clamp-2 text-[11px]">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
