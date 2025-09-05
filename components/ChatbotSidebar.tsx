'use client';

import React, { useState } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

type Message = {
  text: string;
  isUser: boolean;
};

type ChatbotSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatbotSidebar({ 
  isOpen, 
  onClose, 
}: ChatbotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessages: Message[] = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const allCasesData = localStorage.getItem('allCases');
    const groundingData = allCasesData ? JSON.parse(allCasesData) : [];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages, groundingData }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages([...newMessages, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { text: 'Sorry, something went wrong.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="chatbot-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-brand">VISION Assistant</h3>
        <button
          onClick={onClose}
          className="action-btn secondary"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 mb-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            { !msg.isUser && <Bot className="h-6 w-6 text-gray-500" /> }
            <div className={`p-3 rounded-lg max-w-md ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {msg.text}
            </div>
            { msg.isUser && <User className="h-6 w-6 text-gray-500" /> }
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 mb-4">
            <Bot className="h-6 w-6 text-gray-500" />
            <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
              ...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Ask a question..."
            className="form-control"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="action-btn primary"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
