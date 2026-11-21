import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import { AVAILABLE_MODELS } from '../data/dummyData';

export default function ChatInput({
  onSendMessage,
  isGenerating
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

  return (
    <div className="max-w-4xl mx-auto w-full px-3 sm:px-4 pb-4 pt-2">
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] focus-within:border-amber-500 dark:focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-sm transition-all"
      >
        {/* Model status bar */}
        <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 border-b border-[#E7E1D8]/80 dark:border-[#2E2A26]/80">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span>Broadcasting to:</span>
            {AVAILABLE_MODELS.map((m, idx) => (
              <React.Fragment key={m.id}>
                <span className="font-medium text-stone-700 dark:text-stone-300">{m.name}</span>
                {idx < AVAILABLE_MODELS.length - 1 && <span className="text-stone-300 dark:text-stone-700">•</span>}
              </React.Fragment>
            ))}
          </div>

          <span className="hidden sm:inline text-stone-400 dark:text-stone-500 text-[10px]">
            Enter to send • Shift+Enter for new line
          </span>
        </div>

        {/* Textarea + Action Button */}
        <div className="flex items-end p-2 sm:p-2.5 gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question to compare 3 models simultaneously..."
            disabled={isGenerating}
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm resize-none focus:outline-hidden max-h-40 py-1.5 px-2 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`
              p-2 rounded-xl transition-all shrink-0 cursor-pointer
              ${prompt.trim() && !isGenerating
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm active:scale-95'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 opacity-60 cursor-not-allowed'
              }
            `}
            title="Send prompt to 3 models"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
