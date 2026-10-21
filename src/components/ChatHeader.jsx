import React from 'react';
import { Menu, Columns3, Rows3 } from 'lucide-react';
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
    <header className="h-14 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Mobile menu toggle + Chat Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-100 truncate max-w-xs sm:max-w-md">
              {activeConversation?.title || 'New Conversation'}
            </h2>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded">
              3 Models
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 hidden sm:block">
            {messageCount > 0 ? `${messageCount} turns • Choose preferred model to advance` : 'Type a prompt to compare 3 models simultaneously'}
          </p>
        </div>
      </div>

      {/* Right: Status & Layout Switcher */}
      <div className="flex items-center gap-2">
        {/* Backend / DB Status Pill */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-zinc-800 bg-zinc-900/60 text-zinc-400"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${backendStatus?.online ? 'bg-zinc-300' : 'bg-zinc-500'}`}></span>
          <span>{backendStatus?.online ? 'Backend Connected' : 'Local Mode'}</span>
        </div>

        {/* Model Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          {AVAILABLE_MODELS.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-zinc-300 font-medium"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-500"></span>
              <span>{m.name}</span>
            </div>
          ))}
        </div>

        {/* Layout Mode Selector (Grid vs Stacked) */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-zinc-400">
          <button
            onClick={() => onChangeLayout('grid')}
            title="3-Column Grid View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'grid' ? 'bg-zinc-700 text-white' : 'hover:text-zinc-200'}`}
          >
            <Columns3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeLayout('stacked')}
            title="Stacked Tabs View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'stacked' ? 'bg-zinc-700 text-white' : 'hover:text-zinc-200'}`}
          >
            <Rows3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
