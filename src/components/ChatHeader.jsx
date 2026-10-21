import React from 'react';
import { Menu, Columns3, Rows3 } from 'lucide-react';

export default function ChatHeader({
  activeConversation,
  layoutMode,
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
          </div>
          <p className="text-[11px] text-zinc-400 hidden sm:block">
            {messageCount > 0 ? `${messageCount} turns • Choose preferred model to advance` : 'Type a prompt to compare 3 models simultaneously'}
          </p>
        </div>
      </div>

      {/* Right: Layout Switcher Only (Horizontal Grid vs Vertical Stacked) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-zinc-400">
          <button
            onClick={() => onChangeLayout('grid')}
            title="Horizontal 3-Column Grid View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'grid' ? 'bg-zinc-700 text-white' : 'hover:text-zinc-200'}`}
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeLayout('stacked')}
            title="Vertical Stacked View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${layoutMode === 'stacked' ? 'bg-zinc-700 text-white' : 'hover:text-zinc-200'}`}
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
