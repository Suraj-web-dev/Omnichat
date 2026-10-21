import React, { useState } from 'react';
import {
  Trophy,
  Copy,
  Check,
  Clock,
  Cpu,
  ArrowRight
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { AVAILABLE_MODELS } from '../data/dummyData';
import { copyToClipboard } from '../utils/helpers';

export default function MultiModelResponse({
  message,
  layoutMode = 'grid',
  onSelectModel,
  isGenerating
}) {
  const [activeTab, setActiveTab] = useState('gpt-4o');
  const modelsData = message.models || {};

  return (
    <div className="my-6 px-2 sm:px-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            3 Models Compared • Choose one to continue
          </span>
        </div>

        {/* Tab switcher for mobile */}
        <div className="flex sm:hidden items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl w-full">
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setActiveTab(model.id)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === model.id
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Stacked View */}
      {layoutMode === 'stacked' ? (
        <div className="space-y-3">
          {/* Tab Selector Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
            {AVAILABLE_MODELS.map(model => {
              const mData = modelsData[model.id] || {};
              const isSelectedTab = activeTab === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setActiveTab(model.id)}
                  className={`
                    flex-1 flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer
                    ${isSelectedTab
                      ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelectedTab ? 'bg-zinc-200' : 'bg-zinc-600'}`}></span>
                    <span>{model.name}</span>
                    <span className="text-[10px] text-zinc-400">({model.provider})</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/80">
                    {mData.latency || '...'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Card */}
          {AVAILABLE_MODELS.map(model => {
            if (model.id !== activeTab) return null;
            const mData = modelsData[model.id] || {};
            return (
              <ModelResponseCard
                key={model.id}
                model={model}
                data={mData}
                messageId={message.id}
                onSelect={() => onSelectModel(message.id, model.id)}
                isSingleView={true}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {AVAILABLE_MODELS.map(model => {
            const mData = modelsData[model.id] || {};
            return (
              <div
                key={model.id}
                className={`sm:block ${activeTab === model.id ? 'block' : 'hidden sm:block'}`}
              >
                <ModelResponseCard
                  model={model}
                  data={mData}
                  messageId={message.id}
                  onSelect={() => onSelectModel(message.id, model.id)}
                  isSingleView={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModelResponseCard({
  model,
  data,
  messageId,
  onSelect,
  isSingleView
}) {
  const [copied, setCopied] = useState(false);
  const isLoading = data.loading || (!data.content && data.content !== '');

  const handleCopy = () => {
    if (!data.content) return;
    copyToClipboard(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`
      flex flex-col rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-sm overflow-hidden
      transition-all duration-200 hover:border-zinc-700
      ${isSingleView ? 'min-h-[340px]' : 'h-full min-h-[440px]'}
    `}>
      {/* Header */}
      <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-200">
            {model.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-zinc-100 truncate">{model.name}</h3>
              <span className="text-[10px] text-zinc-400 bg-zinc-950 border border-zinc-800/80 px-1.5 py-0.2 rounded">
                {model.provider}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">{model.tagline}</p>
          </div>
        </div>

        {/* Latency */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/80 shrink-0">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{data.latency || '...'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 py-3 animate-pulse">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-3">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>Generating response from {model.name}...</span>
            </div>
            <div className="h-3.5 bg-zinc-800 rounded w-5/6"></div>
            <div className="h-3.5 bg-zinc-800 rounded w-full"></div>
            <div className="h-3.5 bg-zinc-800 rounded w-4/6"></div>
            <div className="h-16 bg-zinc-800/60 rounded-lg my-3"></div>
            <div className="h-3.5 bg-zinc-800 rounded w-3/4"></div>
          </div>
        ) : (
          <MarkdownRenderer content={data.content} />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-2.5">
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
          title="Copy response"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-zinc-200" />
              <span className="text-zinc-200">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={onSelect}
          disabled={isLoading}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer shadow-sm group/btn"
        >
          <Trophy className="w-3.5 h-3.5 text-zinc-800" />
          <span>Choose this Answer</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
