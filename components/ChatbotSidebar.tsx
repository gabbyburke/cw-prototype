'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

type Message = {
  text: string;
  isUser: boolean;
};

type ChatbotModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatbotModal({ 
  isOpen, 
  onClose, 
}: ChatbotModalProps) {
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
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-semibold text-blue-600">VISION Assistant</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`p-2 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="p-2 rounded-lg bg-gray-200">
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
            className="flex-grow p-2 border rounded-l-lg"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
