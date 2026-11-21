import React from 'react';
import { PanelLeftClose, PanelLeftOpen, Columns3, Rows3, Sun, Moon } from 'lucide-react';

export default function ChatHeader({
  activeConversation,
  layoutMode,
  sidebarOpen,
  theme = 'light',
  onToggleTheme,
  onChangeLayout,
  onToggleSidebar
}) {
  const messageCount = activeConversation?.messages?.length || 0;

  return (
    <header className="h-14 border-b border-[#E7E1D8] dark:border-[#2E2A26] bg-[#FAF8F4]/95 dark:bg-[#121110]/95 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20 transition-colors duration-200">
      {/* Left: Sidebar toggle button + Chat Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 border border-[#E7E1D8] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A18] hover:border-amber-400 dark:hover:border-amber-600/60 shadow-xs"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </button>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate max-w-xs sm:max-w-md">
            {activeConversation?.title || 'New Conversation'}
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
            {messageCount > 0 ? `${messageCount} turns • Choose preferred model to advance` : 'Type a prompt to compare 3 models simultaneously'}
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle + Layout Switcher */}
      <div className="flex items-center gap-2">
        {/* Night / Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? "Switch to Warm Sand Mode" : "Switch to Night Mode"}
          aria-label="Toggle Theme"
          className="p-1.5 rounded-lg border border-[#E7E1D8] dark:border-[#2E2A26] bg-white dark:bg-[#1C1A18] text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400 dark:hover:border-amber-600/60 transition-all cursor-pointer shadow-xs flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-stone-600 hover:text-amber-600 animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        {/* Layout Switcher (Horizontal Grid vs Vertical Stacked) */}
        <div className="flex items-center bg-white dark:bg-[#1C1A18] border border-[#E7E1D8] dark:border-[#2E2A26] p-0.5 rounded-lg text-stone-500 dark:text-stone-400 shadow-xs">
          <button
            onClick={() => onChangeLayout('grid')}
            title="Horizontal 3-Column Grid View"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium'
                : 'hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChangeLayout('stacked')}
            title="Vertical Stacked View"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              layoutMode === 'stacked'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium'
                : 'hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
