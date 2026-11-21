import React, { useState, useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import UserMessage from './components/UserMessage';
import MultiModelResponse from './components/MultiModelResponse';
import SelectedMessage from './components/SelectedMessage';
import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';

export default function App() {
  const {
    conversations,
    activeChatId,
    activeConversation,
    isGenerating,
    synthesizingMessageId,
    setActiveChatId,
    createNewChat,
    deleteChat,
    renameChat,
    sendMessage,
    selectModelResponse,
    unselectModelResponse,
    synthesizeModelAnswers
  } = useChat();

  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'stacked'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omnichat_theme') || 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('omnichat_theme', next);
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const messagesEndRef = useRef(null);

  const messages = activeConversation?.messages || [];

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className={`flex h-screen w-screen bg-[#FAF8F4] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f5f4] overflow-hidden font-sans transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#FAF8F4] dark:bg-[#121110] transition-colors duration-200">
        {/* Header */}
        <ChatHeader
          activeConversation={activeConversation}
          layoutMode={layoutMode}
          sidebarOpen={sidebarOpen}
          theme={theme}
          onToggleTheme={toggleTheme}
          onChangeLayout={setLayoutMode}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 lg:px-6">
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={sendMessage} />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6 pb-6">
              {messages.map((message) => {
                if (message.sender === 'user') {
                  return <UserMessage key={message.id} message={message} />;
                }

                // AI Message: Either multi-model comparison cards or chosen model message
                if (message.selectedModelId) {
                  return (
                    <SelectedMessage
                      key={message.id}
                      message={message}
                      onSelectDifferentModel={selectModelResponse}
                      onReopenComparison={unselectModelResponse}
                    />
                  );
                }

                return (
                  <MultiModelResponse
                    key={message.id}
                    message={message}
                    layoutMode={layoutMode}
                    onSelectModel={selectModelResponse}
                    onSynthesize={synthesizeModelAnswers}
                    isSynthesizing={synthesizingMessageId === message.id}
                    isGenerating={isGenerating}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="shrink-0 bg-gradient-to-t from-[#FAF8F4] via-[#FAF8F4]/90 dark:from-[#121110] dark:via-[#121110]/90 to-transparent pt-2">
          <ChatInput
            onSendMessage={sendMessage}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
