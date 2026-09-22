import React, { useState } from 'react';
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
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
  const chosenModel = AVAILABLE_MODELS.find(m => m.id === chosenModelId) || {
    id: chosenModelId,
    name: 'AI Model',
    provider: 'AI Provider',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
  };

  const chosenModelData = message.models?.[chosenModelId] || {};
  const alternativeModels = AVAILABLE_MODELS.filter(m => m.id !== chosenModelId);

  const handleCopy = () => {
    if (!chosenModelData.content) return;
    copyToClipboard(chosenModelData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 px-2 sm:px-4">
      <div className="max-w-4xl rounded-2xl bg-[#121622]/90 border border-slate-800/90 shadow-xl overflow-hidden">
        {/* Selected Model Top Ribbon */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Chosen Response: {chosenModel.name}</span>
            </div>
            <span className="text-[11px] text-slate-400">({chosenModel.provider})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60">
              {chosenModelData.latency || '1.1s'}
            </span>
            <button
              onClick={() => onReopenComparison(message.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer border border-indigo-500/20"
              title="Compare all 3 responses again"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Re-compare 3 Models</span>
            </button>
          </div>
        </div>

        {/* Response Content */}
        <div className="p-4 sm:p-5">
          <MarkdownRenderer content={chosenModelData.content} />
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer text-slate-300"
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

          {/* Toggle Accordion for Other 2 Models */}
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {showAlternatives ? 'Hide' : 'Inspect'} 2 other model alternatives
            </span>
            {showAlternatives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Alternatives Accordion */}
        {showAlternatives && (
          <div className="border-t border-slate-800 bg-slate-950/70 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Alternative Model Outputs (Unselected)
              </h4>
              <span className="text-[11px] text-slate-500">
                You can switch your winner at any time
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternativeModels.map(altModel => {
                const altData = message.models?.[altModel.id] || {};
                return (
                  <div
                    key={altModel.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${altModel.avatarBg}`}>
                            {altModel.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-xs text-white">{altModel.name}</span>
                          <span className="text-[10px] text-slate-400">({altModel.provider})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                          {altData.latency || '1.2s'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 max-h-48 overflow-y-auto mb-3">
                        <MarkdownRenderer content={altData.content} />
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDifferentModel(message.id, altModel.id)}
                      className="w-full mt-2 py-1.5 px-3 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trophy className="w-3 h-3 text-amber-400" />
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
