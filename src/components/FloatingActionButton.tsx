'use client'

import React from 'react'

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: string;
  ariaLabel?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon = 'auto_awesome', 
  ariaLabel = 'Activate AI Assistant' 
}) => {
  return (
    <button className="fab" onClick={onClick} aria-label={ariaLabel}>
      <span className="icon">{icon}</span>
    </button>
  );
};

export default FloatingActionButton;
