import React from 'react';
import { Bot, ArrowUpRight } from 'lucide-react';
import { AVAILABLE_MODELS, QUICK_PROMPTS } from '../data/dummyData';

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 text-center max-w-2xl mx-auto">
      {/* Warm Amber Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/50 flex items-center justify-center text-white mb-5 shadow-sm">
        <Bot className="w-6 h-6 text-white" />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mb-2">
        Ask Once. Compare 3 Models. Pick the Best.
      </h2>
      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mb-8 leading-relaxed">
        Submit any question to execute 3 frontier AI models in parallel. Compare their reasoning side-by-side and lock in the winning answer.
      </p>

      {/* 3 Model Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mb-8">
        {AVAILABLE_MODELS.map(model => (
          <div
            key={model.id}
            className="p-3 rounded-xl bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] text-left hover:border-amber-400 dark:hover:border-amber-600/60 shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded bg-amber-500/10 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-[10px] font-mono text-amber-700 dark:text-amber-400">
                {model.name.charAt(0)}
              </span>
              <span className="font-medium text-xs text-stone-900 dark:text-stone-100 truncate">{model.name}</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">{model.tagline}</p>
          </div>
        ))}
      </div>

      {/* Starter Prompts */}
      <div className="w-full text-left space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 px-1 font-medium">
          Suggested starter prompts
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="text-left p-3 rounded-xl bg-white/90 dark:bg-[#1C1A18]/90 hover:bg-white dark:hover:bg-[#24211E] border border-[#E7E1D8] dark:border-[#2E2A26] hover:border-amber-400 dark:hover:border-amber-600/60 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white shadow-2xs transition-all text-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.title}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-stone-500 dark:text-stone-400 line-clamp-2 text-[11px]">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
