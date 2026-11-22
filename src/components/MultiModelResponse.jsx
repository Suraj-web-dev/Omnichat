import React, { useState } from 'react';
import {
  Trophy,
  Copy,
  Check,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap,
  Scale,
  Award
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { AVAILABLE_MODELS } from '../data/dummyData';
import { copyToClipboard } from '../utils/helpers';

export default function MultiModelResponse({
  message,
  layoutMode = 'grid',
  onSelectModel,
  onSynthesize,
  onJudge,
  isSynthesizing = false,
  isJudging = false,
  isGenerating
}) {
  const [activeTab, setActiveTab] = useState('gpt-4o');
  const modelsData = message.models || {};
  const areModelsReady = !isGenerating && Object.values(modelsData).some(m => m?.content && !m?.loading);
  const evaluation = message.evaluation;

  // Find winner model if evaluation exists
  const winnerModel = evaluation?.winnerModelId
    ? AVAILABLE_MODELS.find(m => m.id === evaluation.winnerModelId)
    : null;

  return (
    <div className="my-6 px-2 sm:px-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            3 Models Compared • Choose one, Judge them, or Synthesize all 3
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

      {/* Dual Action Banner: AI Judge & Master Synthesis */}
      <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#FAF8F4] to-orange-50/90 dark:from-amber-950/40 dark:via-[#181614] dark:to-orange-950/30 border border-amber-300 dark:border-amber-800/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                AI Intelligence Hub
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded font-medium">
                Benchmark & Merge
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
              Let the <strong>AI Judge</strong> score models into <strong>BEST, BETTER & GOOD</strong>, or synthesize all 3 into 1 Master Answer.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* AI Judge Button */}
          {onJudge && (
            <button
              onClick={() => onJudge(message.id)}
              disabled={!areModelsReady || isJudging}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 font-medium text-xs rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs border ${
                evaluation
                  ? 'bg-white dark:bg-[#201D1A] text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-[#282420]'
                  : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 border-stone-800 dark:border-stone-200'
              }`}
              title="Evaluate models into BEST, BETTER and GOOD with numerical scores"
            >
              {isJudging ? (
                <>
                  <Scale className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>Judging Answers...</span>
                </>
              ) : (
                <>
                  <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{evaluation ? 'Re-Judge Models' : '⚖️ Call AI Judge'}</span>
                </>
              )}
            </button>
          )}

          {/* Master Synthesis Button */}
          {onSynthesize && (
            <button
              onClick={() => onSynthesize(message.id)}
              disabled={!areModelsReady || isSynthesizing}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-xs rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs hover:shadow"
              title="Combine best insights of all 3 models"
            >
              {isSynthesizing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Master Synthesis</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Judge Verdict Banner (if evaluation exists) */}
      {evaluation && (
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-100/90 via-amber-50/80 to-orange-100/90 dark:from-amber-950/60 dark:via-[#1E1B18] dark:to-orange-950/40 border-2 border-amber-400/90 dark:border-amber-700 shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500 text-white">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 dark:text-amber-100 uppercase tracking-wider">
                  AI Benchmark Jury Verdict
                </span>
                <span className="text-[10px] ml-2 text-stone-500 dark:text-stone-400 font-mono">
                  {evaluation.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleTimeString() : 'Evaluated'}
                </span>
              </div>
            </div>

            {/* Quick 1-click accept judge's pick */}
            {winnerModel && (
              <button
                onClick={() => onSelectModel(message.id, evaluation.winnerModelId)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xs rounded-lg transition-all active:scale-[0.98] shadow-xs cursor-pointer shrink-0"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-200" />
                <span>Pick Judge's Winner ({winnerModel.name})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="pt-2.5">
            <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {evaluation.overallSummary}
            </p>
          </div>
        </div>
      )}

      {/* Grid or Stacked View */}
      {layoutMode === 'stacked' ? (
        <div className="space-y-3">
          {/* Tab Selector Buttons */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F5EFEB] dark:bg-[#181614] border border-[#E7E1D8] dark:border-[#2E2A26] p-1 rounded-xl">
            {AVAILABLE_MODELS.map(model => {
              const mData = modelsData[model.id] || {};
              const isSelectedTab = activeTab === model.id;
              const modelEval = evaluation?.evaluations?.[model.id];

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

                  <div className="flex items-center gap-1.5">
                    {modelEval && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        modelEval.category === 'BEST'
                          ? 'bg-amber-500 text-white'
                          : modelEval.category === 'BETTER'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}>
                        {modelEval.category} • {modelEval.score}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                      {mData.latency || '...'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tab Card */}
          {AVAILABLE_MODELS.map(model => {
            if (model.id !== activeTab) return null;
            const mData = modelsData[model.id] || {};
            const modelEval = evaluation?.evaluations?.[model.id];

            return (
              <ModelResponseCard
                key={model.id}
                model={model}
                data={mData}
                messageId={message.id}
                onSelect={() => onSelectModel(message.id, model.id)}
                isSingleView={true}
                evaluation={modelEval}
                isWinner={evaluation?.winnerModelId === model.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {AVAILABLE_MODELS.map(model => {
            const mData = modelsData[model.id] || {};
            const modelEval = evaluation?.evaluations?.[model.id];

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
                  evaluation={modelEval}
                  isWinner={evaluation?.winnerModelId === model.id}
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
  isSingleView,
  evaluation,
  isWinner
}) {
  const [copied, setCopied] = useState(false);
  const isLoading = data.loading || (!data.content && data.content !== '');

  const handleCopy = () => {
    if (!data.content) return;
    copyToClipboard(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBest = evaluation?.category === 'BEST' || isWinner;
  const isBetter = evaluation?.category === 'BETTER';
  const isGood = evaluation?.category === 'GOOD';

  return (
    <div className={`
      flex flex-col rounded-2xl bg-white dark:bg-[#1C1A18] border shadow-sm overflow-hidden
      transition-all duration-200 hover:shadow-md
      ${isSingleView ? 'min-h-[340px]' : 'h-full min-h-[440px]'}
      ${isBest
        ? 'border-amber-500 dark:border-amber-500/90 ring-2 ring-amber-500/50 dark:ring-amber-500/40 shadow-amber-500/5'
        : 'border-[#E7E1D8] dark:border-[#2E2A26] hover:border-amber-400 dark:hover:border-amber-600/70'
      }
    `}>
      {/* Header */}
      <div className={`p-3.5 border-b border-[#E7E1D8] dark:border-[#2E2A26] flex items-center justify-between ${
        isBest
          ? 'bg-amber-50/50 dark:bg-amber-950/20'
          : 'bg-[#FBF9F6] dark:bg-[#181614]'
      }`}>
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

      {/* AI Judge Rank & Score Ribbon (if evaluated) */}
      {evaluation && (
        <div className={`px-3.5 py-2 border-b flex items-center justify-between text-xs ${
          isBest
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 dark:from-amber-950/50 dark:via-[#1c1a18] dark:to-orange-950/30 border-amber-300 dark:border-amber-700/80'
            : isBetter
            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40'
            : 'bg-stone-50 dark:bg-[#151413] border-stone-200 dark:border-stone-800'
        }`}>
          <div className="flex items-center gap-1.5">
            {isBest ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-[10px] shadow-2xs tracking-wider">
                <Award className="w-3 h-3 text-amber-200" />
                🥇 BEST
              </span>
            ) : isBetter ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-semibold text-[10px]">
                🥈 BETTER
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-[10px]">
                🥉 GOOD
              </span>
            )}
            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
              Judge Score: <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{evaluation.score}</span>/10
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 dark:text-stone-400 font-medium">
            {isBest ? 'Top Rank' : isBetter ? 'Runner-Up' : 'Baseline'}
          </span>
        </div>
      )}

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

      {/* Judge's Individual Critique Box (if evaluated) */}
      {evaluation?.verdict && !isLoading && (
        <div className="mx-3.5 mb-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-[#151413] border border-amber-200/80 dark:border-amber-800/50">
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <Scale className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Judge's Critique</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
              {evaluation.score}/10
            </span>
          </div>
          <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
            {evaluation.verdict}
          </p>
        </div>
      )}

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
          className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 font-medium text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer shadow-xs hover:shadow group/btn ${
            isBest
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold'
              : 'bg-stone-800 hover:bg-stone-900 dark:bg-[#25221F] dark:hover:bg-[#2E2A26] text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>{isBest ? "Choose Winner" : "Choose this Answer"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
