'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import FloatingActionButton from './FloatingActionButton'
import ChatbotModal from './ChatbotModal'

export default function ClientLayout() {
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
    <>
      <FloatingActionButton onClick={handleFabClick} />
      <ChatbotModal 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </>
  );
}
