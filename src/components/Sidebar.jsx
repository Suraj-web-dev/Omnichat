import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Bot,
  PanelLeftClose
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../data/dummyData';

export default function Sidebar({
  conversations,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  isOpen,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveRename = (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40
          flex flex-col bg-[#0c0c0e] border-r border-zinc-800/80
          transition-all duration-200 ease-in-out shrink-0 overflow-hidden
          ${isOpen
            ? 'w-72 sm:w-80 translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 opacity-0 pointer-events-none'
          }
        `}
      >
        <div className="w-72 sm:w-80 flex flex-col h-full">
          {/* App Branding + Collapse Button */}
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-semibold text-sm text-zinc-100 tracking-tight">OmniChat</h1>
                  <span className="px-1.5 py-0.2 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded">
                    3-Arena
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">Multi-Model Comparison</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
            </button>
          </div>

          {/* New Chat Action */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-lg transition-all active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-zinc-600 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              <span>History</span>
              <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.2 rounded">
                {filteredChats.length}
              </span>
            </div>

            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400">
                No conversations found
              </div>
            ) : (
              filteredChats.map(chat => {
                const isActive = chat.id === activeChatId;
                const isEditing = editingId === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`
                      group relative flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer transition-all text-xs
                      ${isActive
                        ? 'bg-zinc-800 text-white font-medium border border-zinc-700/80'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-zinc-200' : 'text-zinc-400'}`} />
                      
                      {isEditing ? (
                        <input
                          type="text"
                          autoFocus
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRename(chat.id, e);
                            if (e.key === 'Escape') handleCancelRename(e);
                          }}
                          className="bg-black border border-zinc-600 rounded px-1.5 py-0.5 text-xs text-white w-full outline-hidden"
                        />
                      ) : (
                        <span className="truncate">{chat.title}</span>
                      )}
                    </div>

                    {/* Actions on hover/active */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={e => handleSaveRename(chat.id, e)}
                            className="p-1 hover:bg-zinc-700 text-zinc-200 rounded cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 hover:bg-zinc-700 text-zinc-400 rounded cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className={`flex items-center gap-0.5 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                          <button
                            onClick={e => startEditing(chat, e)}
                            className="p-1 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              if (window.confirm('Delete this conversation?')) {
                                onDeleteChat(chat.id);
                              }
                            }}
                            className="p-1 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Models Footer */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-medium text-zinc-300">Models (3x)</span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse"></span>
                Live Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {AVAILABLE_MODELS.map(model => (
                <div
                  key={model.id}
                  className="p-1.5 rounded bg-zinc-900 border border-zinc-800/80 text-center"
                  title={`${model.name} (${model.provider})`}
                >
                  <div className="text-[10px] font-medium text-zinc-200 truncate">{model.name}</div>
                  <div className="text-[9px] text-zinc-400 truncate">{model.provider}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
