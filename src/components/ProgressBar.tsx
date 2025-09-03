'use client'

interface ProgressBarProps {
  percentage: number
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  text?: string
  className?: string
}

export default function ProgressBar({ 
  percentage, 
  size = 'medium', 
  showText = true, 
  text,
  className = '' 
}: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  
  const sizeClasses = {
    small: 'progress-bar-small',
    medium: 'progress-bar',
    large: 'progress-bar-large'
  }
  
  const fillClasses = {
    small: 'progress-fill-small',
    medium: 'progress-fill',
    large: 'progress-fill-large'
  }
  
  const textClasses = {
    small: 'progress-text-small',
    medium: 'progress-text',
    large: 'progress-text-large'
  }

  return (
    <div className={`progress-container ${className}`}>
      <div className={sizeClasses[size]}>
        <div 
          className={fillClasses[size]} 
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
      {showText && (
        <div className={textClasses[size]}>
          {text || `${Math.round(clampedPercentage)}%`}
        </div>
      )}
    </div>
  )
}
