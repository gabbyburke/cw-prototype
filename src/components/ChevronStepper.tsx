'use client'

interface StepperStep {
  id: string
  title: string
  completed: boolean
  started?: boolean
  disabled?: boolean
}

interface ChevronStepperProps {
  steps: StepperStep[]
  currentStep: string
  onStepClick: (stepId: string) => void
  className?: string
}

export default function ChevronStepper({ steps, currentStep, onStepClick, className = '' }: ChevronStepperProps) {
  return (
    <div className={`chevron-stepper ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = step.completed
        const isStarted = step.started
        const isDisabled = step.disabled
        
        return (
          <div
            key={step.id}
            className={`chevron-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isStarted && !isCompleted ? 'started' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => !isDisabled && onStepClick(step.id)}
            style={{ zIndex: steps.length - index }}
          >
            <div className="chevron-content">
              <div className="step-icon">
                {isCompleted ? (
                  <div className="checkbox-icon">
                    <span className="icon">check_box</span>
                  </div>
                ) : (
                  <span className="step-number">{index + 1}</span>
                )}
              </div>
              <span className="step-title">{step.title}</span>
            </div>
          </div>
        )
      })}
      
      <style jsx>{`
        .chevron-stepper {
          display: flex;
          align-items: center;
          margin: 0;
          padding: 0;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        
        .chevron-stepper.full-width {
          width: 100%;
        }
        
        .chevron-stepper.full-width .chevron-step {
          flex: 1;
          min-width: 0;
        }
        
        .chevron-step {
          position: relative;
          display: flex;
          align-items: center;
          padding: 20px 28px 20px 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          margin-right: -14px;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%);
          border: 1px solid #cbd5e1;
        }
        
        .chevron-step:first-child {
          margin-left: 0;
          padding-left: 24px;
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%);
        }
        
        .chevron-step:last-child {
          margin-right: 0;
          padding-right: 24px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%);
        }
        
        .chevron-step:first-child:last-child {
          clip-path: none;
          margin-right: 0;
        }
        
        .chevron-step.completed {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #047857;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        
        .chevron-step.active {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-color: #6d28d9;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .chevron-step.started {
          background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
          color: #6d28d9;
          border-color: #8b5cf6;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
        }
        
        .chevron-step.started .step-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }
        
        .chevron-step.disabled {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
          border-color: #e2e8f0;
        }
        
        .chevron-step:not(.disabled):hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          color: #475569;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .chevron-step.completed:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        .chevron-step.active:hover {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
        }
        
        .chevron-step.disabled:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #94a3b8;
          transform: none;
          box-shadow: none;
        }
        
        .chevron-content {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        
        .step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          font-size: 14px;
          font-weight: 600;
        }
        
        .chevron-step.completed .step-icon,
        .chevron-step.active .step-icon {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .chevron-step.disabled .step-icon {
          background: rgba(148, 163, 184, 0.3);
        }
        
        .step-number {
          font-size: 12px;
          font-weight: 600;
        }
        
        .step-title {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .icon {
          font-family: 'Material Icons';
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}
