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
      <div className="flex items-start gap-3 max-w-3xl flex-row-reverse group">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md ring-2 ring-indigo-500/20 text-white font-semibold text-xs">
          <User className="w-4 h-4" />
        </div>

        <div className="space-y-1 text-right">
          <div className="inline-block text-left bg-indigo-600/90 text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-lg shadow-indigo-950/40 text-sm sm:text-[15px] leading-relaxed border border-indigo-500/30">
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
            <span>{formatTime(message.timestamp)}</span>
            <button
              onClick={handleCopy}
              className="hover:text-slate-200 transition-colors p-0.5"
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

