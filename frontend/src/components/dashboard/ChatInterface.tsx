'use client';

import { useState } from 'react';

interface ChatMessage {
  id: string;
  name: string;
  initials: string;
  message: string;
  timestamp: string;
  avatarColor: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
}

export default function ChatInterface({ messages }: ChatInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'unread'>('new');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-full">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'new'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          New Chats
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'unread'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4 overflow-y-auto max-h-[500px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${msg.avatarColor}`}
            >
              {msg.initials}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
