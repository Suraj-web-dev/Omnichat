import React, { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import { copyToClipboard, formatTime } from '../utils/helpers';

export default function UserMessage({ message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end my-4 px-2 sm:px-4">
      <div className="flex items-start gap-2.5 max-w-3xl flex-row-reverse group">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border border-amber-400/50 flex items-center justify-center shrink-0 text-white text-xs shadow-xs">
          <User className="w-3.5 h-3.5" />
        </div>

        <div className="space-y-1 text-right">
          <div className="inline-block text-left bg-stone-900 dark:bg-[#24211E] text-[#FAF8F4] dark:text-[#F5F5F4] px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-sm text-sm leading-relaxed border border-stone-800 dark:border-[#38332D]">
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          <div className="flex items-center justify-end gap-2 text-[11px] text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
            <span>{formatTime(message.timestamp)}</span>
            <button
              onClick={handleCopy}
              className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors p-0.5 cursor-pointer"
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
