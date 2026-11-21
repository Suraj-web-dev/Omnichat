import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { copyToClipboard } from '../utils/helpers';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split content by code blocks ```lang ... ```
  const parts = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      value: match[2]
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.substring(lastIndex)
    });
  }

  return (
    <div className="space-y-3 leading-relaxed text-[14px] text-stone-800 dark:text-stone-200">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} language={part.language} code={part.value} />;
        }
        return <FormattedText key={idx} text={part.value} />;
      })}
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#E7E1D8] dark:border-[#2E2A26] bg-[#FDFCFB] dark:bg-[#121110] font-mono text-[13px] shadow-2xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#F5EFEB] dark:bg-[#181614] border-b border-[#E7E1D8] dark:border-[#2E2A26] text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="font-medium text-stone-800 dark:text-stone-300">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-amber-100 dark:hover:bg-amber-950/40 text-stone-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-stone-800 dark:text-stone-200">
        <pre className="whitespace-pre">{code.trim()}</pre>
      </div>
    </div>
  );
}

function FormattedText({ text }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={i} className="h-1" />;
        }

        // Heading 3
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 mt-3 mb-1">
              {formatInline(line.replace('### ', ''))}
            </h3>
          );
        }
        // Heading 2
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 mt-4 mb-1 border-b border-[#E7E1D8] dark:border-[#2E2A26] pb-1">
              {formatInline(line.replace('## ', ''))}
            </h2>
          );
        }
        // Heading 1
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 mt-4 mb-2">
              {formatInline(line.replace('# ', ''))}
            </h1>
          );
        }
        // Heading 4
        if (line.startsWith('#### ')) {
          return (
            <h4 key={i} className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 mt-2 mb-1">
              {formatInline(line.replace('#### ', ''))}
            </h4>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-2 border-amber-500 pl-3 py-1 my-1.5 bg-amber-50/50 dark:bg-amber-950/20 text-stone-700 dark:text-stone-300 italic text-sm rounded-r">
              {formatInline(line.replace('> ', ''))}
            </blockquote>
          );
        }

        // Unordered List item
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold leading-5">•</span>
              <span className="text-stone-700 dark:text-stone-300">{formatInline(line.replace(/^[-*]\s+/, ''))}</span>
            </div>
          );
        }

        // Numbered List item
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-amber-900 dark:text-amber-300 font-mono text-xs bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.5 rounded">
                {numMatch[1]}
              </span>
              <span className="text-stone-700 dark:text-stone-300">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        // Table row detection
        if (line.startsWith('|')) {
          const cells = line.split('|').map(c => c.trim()).filter((_, index, arr) => index > 0 && index < arr.length - 1);
          if (cells.some(c => c.includes('---'))) {
            return null; // separator row
          }
          return (
            <div key={i} className="grid grid-cols-3 gap-2 p-2 bg-white dark:bg-[#1C1A18] rounded-lg border border-[#E7E1D8] dark:border-[#2E2A26] text-xs text-stone-800 dark:text-stone-200 shadow-2xs">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium">
                  {formatInline(cell)}
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={i} className="text-stone-700 dark:text-stone-300 leading-relaxed">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline formatting: **bold**, `code`, *italic*
function formatInline(str) {
  if (!str) return '';

  const tokens = [];
  const inlineRegex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'raw', text: str.substring(lastIndex, match.index) });
    }
    const chunk = match[0];
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      tokens.push({ type: 'bold', text: chunk.slice(2, -2) });
    } else if (chunk.startsWith('`') && chunk.endsWith('`')) {
      tokens.push({ type: 'inline-code', text: chunk.slice(1, -1) });
    } else if (chunk.startsWith('*') && chunk.endsWith('*')) {
      tokens.push({ type: 'italic', text: chunk.slice(1, -1) });
    }
    lastIndex = match.index + chunk.length;
  }

  if (lastIndex < str.length) {
    tokens.push({ type: 'raw', text: str.substring(lastIndex) });
  }

  return tokens.map((token, i) => {
    if (token.type === 'bold') {
      return <strong key={i} className="font-semibold text-stone-900 dark:text-stone-100">{token.text}</strong>;
    }
    if (token.type === 'inline-code') {
      return (
        <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/10 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-mono">
          {token.text}
        </code>
      );
    }
    if (token.type === 'italic') {
      return <em key={i} className="italic text-stone-600 dark:text-stone-400">{token.text}</em>;
    }
    return <span key={i}>{token.text}</span>;
  });
}
