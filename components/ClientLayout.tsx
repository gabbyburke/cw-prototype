'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import FloatingActionButton from './FloatingActionButton'
import ChatbotModal from './ChatbotSidebar'
import ChatbotSidebar from "./ChatbotSidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const handleFabClick = () => {
    if (pathname === '/') {
      setIsChatbotOpen(true)
    } else {
      // Handle other FAB clicks for different routes if needed
      console.log(`${pathname} FAB clicked!`);
    }
  };

  return (
    <div className={isChatbotOpen ? 'chatbot-open' : ''}>
      {children}
      <FloatingActionButton onClick={handleFabClick} />
      <ChatbotSidebar
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
}
