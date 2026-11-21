import React, { useState } from 'react';
import {
  Trophy,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { AVAILABLE_MODELS } from '../data/dummyData';
import { copyToClipboard } from '../utils/helpers';

export default function MultiModelResponse({
  message,
  layoutMode = 'grid',
  onSelectModel,
  onSynthesize,
  isSynthesizing = false,
  isGenerating
}) {
  const [activeTab, setActiveTab] = useState('gpt-4o');
  const modelsData = message.models || {};
  const areModelsReady = !isGenerating && Object.values(modelsData).some(m => m?.content && !m?.loading);

  return (
    <div className="my-6 px-2 sm:px-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            3 Models Compared • Choose one or Synthesize all 3
          </span>
        </div>

        {/* Tab switcher for mobile */}
        <div className="flex sm:hidden items-center gap-1 bg-[#F5EFEB] dark:bg-[#181614] border border-[#E7E1D8] dark:border-[#2E2A26] p-1 rounded-xl w-full">
          {AVAILABLE_MODELS.map(model => (
            <button
              key={model.id}
              onClick={() => setActiveTab(model.id)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === model.id
                  ? 'bg-white dark:bg-[#1C1A18] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Consensus & Master Synthesis Banner */}
      <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-[#FAF8F4] to-orange-50/90 dark:from-amber-950/40 dark:via-[#181614] dark:to-orange-950/30 border border-amber-300 dark:border-amber-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">AI Consensus & Synthesis</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded font-medium">
                Master Model
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Can't choose? Merge the best points, clean code, and insights of Groq, Cohere & Gemini into 1 master response.
            </p>
          </div>
        </div>

        {onSynthesize && (
          <button
            onClick={() => onSynthesize(message.id)}
            disabled={!areModelsReady || isSynthesizing}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-sm hover:shadow shrink-0"
            title="Combine best insights of all 3 models"
          >
            {isSynthesizing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Best of 3...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesize Master Answer</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid or Stacked View */}
      {layoutMode === 'stacked' ? (
        <div className="space-y-3">
          {/* Tab Selector Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F5EFEB] dark:bg-[#181614] border border-[#E7E1D8] dark:border-[#2E2A26] p-1 rounded-xl">
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
                      ? 'bg-white dark:bg-[#1C1A18] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-[#ECE4DC] dark:hover:bg-[#24211E] border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelectedTab ? 'bg-amber-500' : 'bg-stone-400'}`}></span>
                    <span>{model.name}</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">({model.provider})</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
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
      flex flex-col rounded-2xl bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] shadow-sm overflow-hidden
      transition-all duration-200 hover:border-amber-400 dark:hover:border-amber-600/70 hover:shadow-md
      ${isSingleView ? 'min-h-[340px]' : 'h-full min-h-[440px]'}
    `}>
      {/* Header */}
      <div className="p-3.5 border-b border-[#E7E1D8] dark:border-[#2E2A26] bg-[#FBF9F6] dark:bg-[#181614] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-xs font-semibold text-amber-700 dark:text-amber-400">
            {model.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-stone-900 dark:text-stone-100 truncate">{model.name}</h3>
              <span className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.2 rounded font-medium">
                {model.provider}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{model.tagline}</p>
          </div>
        </div>

        {/* Latency & Speed Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-[#FAF8F4] dark:bg-[#121110] px-2 py-0.5 rounded-md border border-[#E7E1D8] dark:border-[#2E2A26] shrink-0 font-medium">
          <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>{data.latency || '...'}</span>
          {data.tokens ? (
            <span className="text-[10px] text-stone-400 dark:text-stone-500 border-l border-[#E7E1D8] dark:border-[#2E2A26] pl-1.5 ml-0.5 hidden sm:inline">
              {data.tokens}t
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3 py-3 animate-pulse">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-medium mb-3">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              <span>Generating response from {model.name}...</span>
            </div>
            <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded w-5/6"></div>
            <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded w-full"></div>
            <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded w-4/6"></div>
            <div className="h-16 bg-stone-100/70 dark:bg-stone-800/60 rounded-lg my-3"></div>
            <div className="h-3.5 bg-stone-100 dark:bg-stone-800 rounded w-3/4"></div>
          </div>
        ) : (
          <MarkdownRenderer content={data.content} />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#E7E1D8] dark:border-[#2E2A26] bg-[#FBF9F6] dark:bg-[#181614] flex items-center justify-between gap-2.5">
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-stone-600 dark:text-stone-400 hover:bg-[#F5EFEB] dark:hover:bg-[#24211E] hover:text-stone-900 dark:hover:text-stone-200 transition-colors disabled:opacity-40 cursor-pointer"
          title="Copy response"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-400 font-medium">Copied</span>
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
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer shadow-xs hover:shadow group/btn"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Choose this Answer</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
