import React, { useState } from 'react';
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { AVAILABLE_MODELS } from '../data/dummyData';
import { copyToClipboard } from '../utils/helpers';

export default function SelectedMessage({
  message,
  onSelectDifferentModel,
  onReopenComparison
}) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [copied, setCopied] = useState(false);

  const chosenModelId = message.selectedModelId;
  const isSynthesized = chosenModelId === 'synthesized';

  const chosenModel = isSynthesized
    ? {
        id: 'synthesized',
        name: 'Master Synthesis (Consensus)',
        provider: 'Groq + Cohere + Gemini'
      }
    : AVAILABLE_MODELS.find(m => m.id === chosenModelId) || {
        id: chosenModelId,
        name: 'AI Model',
        provider: 'AI Provider'
      };

  const chosenModelData = message.models?.[chosenModelId] || {};
  const alternativeModels = isSynthesized
    ? AVAILABLE_MODELS
    : AVAILABLE_MODELS.filter(m => m.id !== chosenModelId);

  const handleCopy = () => {
    if (!chosenModelData.content) return;
    copyToClipboard(chosenModelData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 px-2 sm:px-4">
      <div className="max-w-4xl rounded-2xl bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] shadow-sm overflow-hidden">
        {/* Selected Model Top Ribbon */}
        <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 ${
          isSynthesized
            ? 'bg-gradient-to-r from-amber-100/90 via-orange-100/70 to-amber-50 dark:from-amber-950/60 dark:via-[#24211E] dark:to-orange-950/40 border-amber-300 dark:border-amber-800/70'
            : 'bg-[#FBF9F6] dark:bg-[#181614] border-[#E7E1D8] dark:border-[#2E2A26]'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shadow-2xs ${
              isSynthesized
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500'
                : 'bg-amber-600 text-white border-amber-500'
            }`}>
              {isSynthesized ? (
                <Sparkles className="w-3.5 h-3.5 text-white" />
              ) : (
                <Trophy className="w-3.5 h-3.5 text-white" />
              )}
              <span>{isSynthesized ? 'Master Synthesis' : `Chosen: ${chosenModel.name}`}</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">({chosenModel.provider})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-[#FAF8F4] dark:bg-[#121110] px-2 py-0.5 rounded-md border border-[#E7E1D8] dark:border-[#2E2A26] font-medium">
              <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              {chosenModelData.latency || '...'}
            </span>
            <button
              onClick={() => onReopenComparison(message.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-md transition-colors cursor-pointer border border-[#E7E1D8] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A18] shadow-2xs"
              title="Compare all 3 models again"
            >
              <RefreshCw className="w-3 h-3 text-stone-400 dark:text-stone-500" />
              <span>Re-compare</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <MarkdownRenderer content={chosenModelData.content} />
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#FBF9F6] dark:bg-[#181614] border-t border-[#E7E1D8] dark:border-[#2E2A26] flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-[#F5EFEB] dark:hover:bg-[#24211E] hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-700 dark:text-amber-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy response</span>
              </>
            )}
          </button>

          {/* Alternatives toggle */}
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F5EFEB] dark:bg-[#24211E] hover:bg-amber-100 dark:hover:bg-amber-950/50 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-200 transition-all cursor-pointer font-medium border border-[#E7E1D8] dark:border-[#2E2A26] shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>
              {showAlternatives ? 'Hide' : 'Inspect'} {isSynthesized ? 'original 3 model answers' : 'other 2 model answers'}
            </span>
            {showAlternatives ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Alternatives */}
        {showAlternatives && (
          <div className="border-t border-[#E7E1D8] dark:border-[#2E2A26] bg-[#FAF8F4] dark:bg-[#121110] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 font-medium">
                {isSynthesized ? 'Source Models (Synthesized Ingredients)' : 'Alternative Responses (Unselected)'}
              </h4>
              <span className="text-[11px] text-stone-500">
                Switch winner anytime
              </span>
            </div>

            <div className={`grid grid-cols-1 ${isSynthesized ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
              {alternativeModels.map(altModel => {
                const altData = message.models?.[altModel.id] || {};
                return (
                  <div
                    key={altModel.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] flex flex-col justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E7E1D8] dark:border-[#2E2A26]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">{altModel.name}</span>
                          <span className="text-[10px] text-stone-500 dark:text-stone-400">({altModel.provider})</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-[#FAF8F4] dark:bg-[#121110] px-1.5 py-0.5 rounded border border-[#E7E1D8] dark:border-[#2E2A26]">
                          {altData.latency || '...'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-700 dark:text-stone-300 max-h-48 overflow-y-auto mb-3">
                        <MarkdownRenderer content={altData.content} />
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDifferentModel(message.id, altModel.id)}
                      className="w-full mt-2 py-1.5 px-3 bg-[#F5EFEB] dark:bg-[#24211E] hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white text-stone-700 dark:text-stone-300 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#E7E1D8] dark:border-[#2E2A26] shadow-2xs"
                    >
                      <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Switch Winner to {altModel.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
