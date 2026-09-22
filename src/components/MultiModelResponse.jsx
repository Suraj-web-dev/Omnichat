import React, { useState } from 'react';
import {
  Sparkles,
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
      {/* Selection Guidance Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            3 Models Generated Answers • Choose one to proceed
          </span>
        </div>

        {/* Tab switcher for mobile */}
        <div className="flex sm:hidden items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-full">
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setActiveTab(model.id)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === model.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Tab View Container */}
      {layoutMode === 'stacked' ? (
        // Stacked Tab View
        <div className="space-y-3">
          {/* Tab Selector Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-2xl">
            {AVAILABLE_MODELS.map(model => {
              const mData = modelsData[model.id] || {};
              const isSelectedTab = activeTab === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setActiveTab(model.id)}
                  className={`
                    flex-1 flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer
                    ${isSelectedTab
                      ? `bg-slate-800 text-white shadow-md border border-slate-700`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelectedTab ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`}></span>
                    <span>{model.name}</span>
                    <span className="text-[10px] text-slate-400">({model.provider})</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded">
                    {mData.latency || '...'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Render Active Tab Card */}
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
        // 3-Column Responsive Grid View
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
      flex flex-col rounded-2xl bg-[#141824]/90 border border-slate-800/90 shadow-xl overflow-hidden
      transition-all duration-200 hover:border-slate-700/80 hover:shadow-indigo-500/5
      ${isSingleView ? 'min-h-[360px]' : 'h-full min-h-[460px]'}
    `}>
      {/* Model Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold ${model.avatarBg}`}>
            {model.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white truncate">{model.name}</h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {model.provider}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{model.tagline}</p>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800/60">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{data.latency || '...'}</span>
          </div>
        </div>
      </div>

      {/* Model Output Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 py-4 animate-pulse">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-3">
              <Cpu className="w-4 h-4 animate-spin" />
              <span>Generating response from {model.name}...</span>
            </div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-4/6"></div>
            <div className="h-20 bg-slate-800/60 rounded-xl my-3"></div>
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          </div>
        ) : (
          <MarkdownRenderer content={data.content} />
        )}
      </div>

      {/* Card Action Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2.5">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
          title="Copy answer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Primary Selection Action */}
        <button
          onClick={onSelect}
          disabled={isLoading}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer group/btn"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-300 group-hover/btn:scale-110 transition-transform" />
          <span>Choose this Answer</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
