import React from 'react';
import { Menu, Sparkles, Columns3, Rows3 } from 'lucide-react';
import { AVAILABLE_MODELS } from '../data/dummyData';

export default function ChatHeader({
  activeConversation,
  layoutMode,
  backendStatus,
  onChangeLayout,
  onToggleSidebar
}) {
  const messageCount = activeConversation?.messages?.length || 0;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0d1017]/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Mobile menu toggle + Chat Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-semibold text-white truncate max-w-xs sm:max-w-md">
              {activeConversation?.title || 'New Multi-Model Session'}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              3 Models Arena
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {messageCount > 0 ? `${messageCount} message turns • Select preferred model to advance` : 'Type a prompt to compare 3 models'}
          </p>
        </div>
      </div>

      {/* Right: Layout Switcher & Model Pill Indicators */}
      <div className="flex items-center gap-2">
        {/* Backend / DB Status Pill */}
        <div
          title={backendStatus?.online ? "Express & MongoDB Backend Active" : "Local Mode Active"}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
            backendStatus?.online
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${backendStatus?.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span>{backendStatus?.online ? 'Backend: Connected' : 'Local Mode'}</span>
        </div>

        {/* Model Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {AVAILABLE_MODELS.map(m => (
            <div
              key={m.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border ${m.badgeColor}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span className="font-semibold">{m.name}</span>
            </div>
          ))}
        </div>

        {/* Layout Mode Selector (Grid vs Stacked) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-slate-400">
          <button
            onClick={() => onChangeLayout('grid')}
            title="3-Column Grid View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-slate-200'}`}
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeLayout('stacked')}
            title="Stacked Tabs View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'stacked' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:text-slate-200'}`}
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
