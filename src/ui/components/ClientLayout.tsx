'use client'

import FloatingActionButton from './FloatingActionButton'

export default function ClientLayout() {
  const handleFabClick = () => {
    console.log('AI Assistant FAB clicked!');
    // Placeholder for AI assistant activation logic
  };

  return (
    <FloatingActionButton onClick={handleFabClick} />
  );
}
