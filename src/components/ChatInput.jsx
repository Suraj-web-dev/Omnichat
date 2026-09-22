import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CornerDownLeft, ArrowUp, Zap } from 'lucide-react';
import { QUICK_PROMPTS, AVAILABLE_MODELS } from '../data/dummyData';

export default function ChatInput({
  onSendMessage,
  isGenerating,
  showQuickPrompts = false
}) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [prompt]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onSendMessage(prompt.trim());
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectQuickPrompt = (qPrompt) => {
    onSendMessage(qPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 pb-4 pt-2">
      {/* Quick Prompts Chips (when conversation is empty or requested) */}
      {showQuickPrompts && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Try a quick comparison prompt:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectQuickPrompt(item.prompt)}
                className="text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-indigo-300 group-hover:text-indigo-200">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <p className="text-slate-400 line-clamp-1 group-hover:text-slate-300">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl bg-[#141824] border border-slate-700/80 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-xl transition-all"
      >
        {/* Model tags row */}
        <div className="px-3.5 pt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/50 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Broadcasting to:</span>
            <span className="font-semibold text-emerald-400">GPT-4o</span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-amber-400">Claude 3.5</span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-blue-400">Gemini 1.5</span>
          </div>

          <span className="hidden sm:inline text-slate-500 text-[10px]">
            Shift + Enter for new line
          </span>
        </div>

        {/* Textarea */}
        <div className="flex items-end p-2 sm:p-3 gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... all 3 AI models will generate answers simultaneously"
            disabled={isGenerating}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-[15px] resize-none focus:outline-hidden max-h-44 py-1.5 px-2 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`
              p-2.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer
              ${prompt.trim() && !isGenerating
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-100 active:scale-95'
                : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }
            `}
            title="Send prompt to 3 models"
          >
            {isGenerating ? (
              <Sparkles className="w-5 h-5 animate-spin text-indigo-300" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

