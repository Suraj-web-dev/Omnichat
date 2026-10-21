import React from 'react';
import { PanelLeftClose, PanelLeftOpen, Columns3, Rows3 } from 'lucide-react';

export default function ChatHeader({
  activeConversation,
  layoutMode,
  sidebarOpen,
  onChangeLayout,
  onToggleSidebar
}) {
  const messageCount = activeConversation?.messages?.length || 0;

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
      {/* Left: Sidebar toggle button + Chat Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-zinc-800/90 bg-zinc-900/80"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-zinc-300" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-zinc-200" />
          )}
        </button>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-100 truncate max-w-xs sm:max-w-md">
            {activeConversation?.title || 'New Conversation'}
          </h2>
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
