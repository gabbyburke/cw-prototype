'use client'

import { Case } from '@/lib/api'
import Link from 'next/link'
import ProgressBar from './ProgressBar'

interface TaskTableProps {
  taskType: string
  cases: Case[]
  onActionClick: (case_: Case) => void
}

// Case setup milestones for progress tracking
const CASE_SETUP_MILESTONES = [
  'initial_assessment',
  'persons_verified', 
  'living_arrangements',
  'safety_plan',
  'case_notes',
  'supervisor_review'
]

// Helper function to get case setup progress from localStorage
const getCaseSetupProgress = (caseId: string) => {
  try {
    const saved = localStorage.getItem(`case_setup_${caseId}`)
    if (!saved) return { completed: [], percentage: 0, step: 0, total: CASE_SETUP_MILESTONES.length }
    
    const data = JSON.parse(saved)
    const completed = data.completedMilestones || []
    const percentage = Math.round((completed.length / CASE_SETUP_MILESTONES.length) * 100)
    
    return { 
      completed, 
      percentage, 
      step: completed.length, 
      total: CASE_SETUP_MILESTONES.length 
    }
  } catch (error) {
    return { completed: [], percentage: 0, step: 0, total: CASE_SETUP_MILESTONES.length }
  }
}

// Configuration for different task types
const taskConfigs = {
  'request-assignment': {
    title: 'Ready to Request SWCM Assignment',
    columns: ['Incident Number', 'Intake Date', 'Key Allegation', 'Actions'],
    actionButton: { text: 'Request Assignment', icon: 'assignment_ind', className: 'primary' }
  },
  'edits-required': {
    title: 'Edits Required',
    columns: ['Case Name', 'Last Updated', 'Supervisor Note', 'Actions'],
    actionButton: { text: 'View & Edit', icon: 'edit', className: 'error' }
  },
  'case-setup': {
    title: 'Ready for Setup',
    columns: ['Case Name', 'Assigned SWCM', 'Setup Progress', 'Actions'],
    actionButton: { text: 'Start Setup', icon: 'settings', className: 'secondary' }
  }
}

export default function TaskTable({ taskType, cases, onActionClick }: TaskTableProps) {
  const config = taskConfigs[taskType as keyof typeof taskConfigs]
  
  if (!config) {
    return (
      <div className="task-table-container">
        <div className="error-message">
          <span className="icon">error</span>
          Unknown task type: {taskType}
        </div>
      </div>
    )
  }

  const renderCellContent = (case_: Case, columnIndex: number) => {
    switch (taskType) {
      case 'request-assignment':
        switch (columnIndex) {
          case 0: // Incident Number
            return (
              <div className="case-name-cell">
                <Link href={`/cases/${case_.case_id}`} className="case-link">
                  <strong>{case_.case_number}</strong>
                </Link>
              </div>
            )
          case 1: // Intake Date
            return new Date(case_.created_date).toLocaleDateString()
          case 2: // Key Allegation
            return (
              <div className="allegation-cell">
                <span className="allegation-type">{case_.allegation_type}</span>
                <div className="allegation-desc">{case_.allegation_description}</div>
              </div>
            )
          case 3: // Actions
            return (
              <button 
                onClick={() => onActionClick(case_)}
                className={`action-btn small ${config.actionButton.className}`}
                title={config.actionButton.text}
              >
                <span className="icon">{config.actionButton.icon}</span>
                {config.actionButton.text}
              </button>
            )
          default:
            return null
        }
      
      case 'edits-required':
        // Placeholder for future implementation
        switch (columnIndex) {
          case 0: // Case Name
            return (
              <div className="case-name-cell">
                <Link href={`/cases/${case_.case_id}`} className="case-link">
                  <strong>{case_.case_display_name || case_.family_name}</strong>
                </Link>
                <div className="case-number">{case_.case_number}</div>
              </div>
            )
          case 1: // Last Updated
            return new Date(case_.created_date).toLocaleDateString()
          case 2: // Supervisor Note
            return "Placeholder for supervisor feedback"
          case 3: // Actions
            return (
              <button 
                onClick={() => onActionClick(case_)}
                className={`action-btn small ${config.actionButton.className}`}
                title={config.actionButton.text}
              >
                <span className="icon">{config.actionButton.icon}</span>
                {config.actionButton.text}
              </button>
            )
          default:
            return null
        }
      
      case 'case-setup':
        // Placeholder for future implementation
        switch (columnIndex) {
          case 0: // Case Name
            return (
              <div className="case-name-cell">
                <Link href={`/cases/${case_.case_id}`} className="case-link">
                  <strong>{case_.case_display_name || case_.family_name}</strong>
                </Link>
                <div className="case-number">{case_.case_number}</div>
              </div>
            )
          case 1: // Assigned SWCM
            return case_.assigned_worker || 'Unassigned'
          case 2: // Setup Progress
            const progress = getCaseSetupProgress(case_.case_id)
            return (
              <ProgressBar 
                percentage={progress.percentage}
                size="small"
                text={`${progress.step}/${progress.total} Steps`}
              />
            )
          case 3: // Actions
            return (
              <button 
                onClick={() => onActionClick(case_)}
                className={`action-btn small ${config.actionButton.className}`}
                title={config.actionButton.text}
              >
                <span className="icon">{config.actionButton.icon}</span>
                {config.actionButton.text}
              </button>
            )
          default:
            return null
        }
      
      default:
        return null
    }
  }

  return (
    <div className="task-table-container">
      <div className="task-table-header">
        <h3 className="task-table-title">{config.title}</h3>
        <div className="task-table-count">{cases.length} cases</div>
      </div>
      
      {cases.length > 0 ? (
        <div className="table-container">
          <table className="data-table task-table">
            <thead>
              <tr>
                {config.columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((case_) => (
                <tr key={case_.case_id}>
                  {config.columns.map((_, columnIndex) => (
                    <td key={columnIndex}>
                      {renderCellContent(case_, columnIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <span className="icon large">check_circle</span>
          <h3>No Cases in Queue</h3>
          <p>All cases for this task have been completed.</p>
        </div>
      )}
    </div>
  )
}
