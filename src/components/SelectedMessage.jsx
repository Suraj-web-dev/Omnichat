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
      <div className="max-w-4xl rounded-2xl bg-zinc-900/80 border border-zinc-700/80 shadow-sm overflow-hidden">
        {/* Selected Model Top Ribbon */}
        <div className="px-4 py-2.5 bg-zinc-800/80 border-b border-zinc-700/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              isSynthesized
                ? 'bg-zinc-100 text-zinc-950 border-white'
                : 'bg-zinc-700 text-zinc-100 border-zinc-600'
            }`}>
              {isSynthesized ? (
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              ) : (
                <Trophy className="w-3.5 h-3.5 text-zinc-300" />
              )}
              <span>{isSynthesized ? 'Master Synthesis' : `Chosen: ${chosenModel.name}`}</span>
            </div>
            <span className="text-[11px] text-zinc-400">({chosenModel.provider})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              <Zap className="w-3 h-3 text-zinc-400" />
              {chosenModelData.latency || '...'}
            </span>
            <button
              onClick={() => onReopenComparison(message.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/60 rounded-md transition-colors cursor-pointer border border-zinc-700"
              title="Compare all 3 models again"
            >
              <RefreshCw className="w-3 h-3 text-zinc-400" />
              <span>Re-compare</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <MarkdownRenderer content={chosenModelData.content} />
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-900/50 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-zinc-200" />
                <span className="text-zinc-200">Copied</span>
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer font-medium"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {showAlternatives ? 'Hide' : 'Inspect'} {isSynthesized ? 'original 3 model answers' : 'other 2 model answers'}
            </span>
            {showAlternatives ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Alternatives */}
        {showAlternatives && (
          <div className="border-t border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {isSynthesized ? 'Source Models (Synthesized Ingredients)' : 'Alternative Responses (Unselected)'}
              </h4>
              <span className="text-[11px] text-zinc-500">
                Switch winner anytime
              </span>
            </div>

            <div className={`grid grid-cols-1 ${isSynthesized ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
              {alternativeModels.map(altModel => {
                const altData = message.models?.[altModel.id] || {};
                return (
                  <div
                    key={altModel.id}
                    className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-zinc-200">{altModel.name}</span>
                          <span className="text-[10px] text-zinc-400">({altModel.provider})</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                          {altData.latency || '...'}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-300 max-h-48 overflow-y-auto mb-3">
                        <MarkdownRenderer content={altData.content} />
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDifferentModel(message.id, altModel.id)}
                      className="w-full mt-2 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700"
                    >
                      <Trophy className="w-3 h-3 text-zinc-400" />
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
