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
    <div className="space-y-3 leading-relaxed text-[14px] text-zinc-200">
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
    <div className="my-3 rounded-xl overflow-hidden border border-zinc-800 bg-[#09090b] font-mono text-[13px]">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-300">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-zinc-200" />
              <span className="text-zinc-200">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-zinc-300">
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
            <h3 key={i} className="text-sm sm:text-base font-semibold text-zinc-100 mt-3 mb-1">
              {formatInline(line.replace('### ', ''))}
            </h3>
          );
        }
        // Heading 2
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-base sm:text-lg font-semibold text-zinc-100 mt-4 mb-1 border-b border-zinc-800/80 pb-1">
              {formatInline(line.replace('## ', ''))}
            </h2>
          );
        }
        // Heading 1
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="text-lg sm:text-xl font-bold text-zinc-100 mt-4 mb-2">
              {formatInline(line.replace('# ', ''))}
            </h1>
          );
        }
        // Heading 4
        if (line.startsWith('#### ')) {
          return (
            <h4 key={i} className="text-xs sm:text-sm font-semibold text-zinc-300 mt-2 mb-1">
              {formatInline(line.replace('#### ', ''))}
            </h4>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={i} className="border-l-2 border-zinc-600 pl-3 py-1 my-1.5 bg-zinc-900/40 text-zinc-300 italic text-sm rounded-r">
              {formatInline(line.replace('> ', ''))}
            </blockquote>
          );
        }

        // Unordered List item
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-zinc-500 font-bold leading-5">•</span>
              <span className="text-zinc-300">{formatInline(line.replace(/^[-*]\s+/, ''))}</span>
            </div>
          );
        }

        // Numbered List item
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
              <span className="text-zinc-400 font-mono text-xs bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.5 rounded">
                {numMatch[1]}
              </span>
              <span className="text-zinc-300">{formatInline(numMatch[2])}</span>
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
            <div key={i} className="grid grid-cols-3 gap-2 p-2 bg-zinc-900/60 rounded-lg border border-zinc-800 text-xs text-zinc-300">
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="font-medium">
                  {formatInline(cell)}
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={i} className="text-zinc-300 leading-relaxed">
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
      return <strong key={i} className="font-semibold text-zinc-100">{token.text}</strong>;
    }
    if (token.type === 'inline-code') {
      return (
        <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-xs font-mono">
          {token.text}
        </code>
      );
    }
    if (token.type === 'italic') {
      return <em key={i} className="italic text-zinc-300">{token.text}</em>;
    }
    return <span key={i}>{token.text}</span>;
  });
}
