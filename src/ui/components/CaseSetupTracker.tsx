'use client'

import { useState, useEffect } from 'react'
import { Case, updateCase } from '@/lib/api'
import ProgressBar from './ProgressBar'
import ChevronStepper from './ChevronStepper'

interface CaseSetupTrackerProps {
  case_: Case
  onProgressUpdate?: () => void
  onTabChange?: (tab: string, subTab?: string) => void
}

interface SetupMilestone {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

interface CaseSetupProgress {
  caseId: string
  completedMilestones: string[]
  lastUpdated: string
}

const SETUP_STEPS: Omit<SetupMilestone, 'completed'>[] = [
  {
    id: 'associations',
    title: 'Associations',
    description: 'Manage family associations and relationships',
    required: true
  },
  {
    id: 'living_arrangements',
    title: 'Living Arrangements',
    description: 'Document current living arrangements for all children',
    required: true
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Set up and manage case services',
    required: true
  },
  {
    id: 'court',
    title: 'Court',
    description: 'Manage court information and legal documents',
    required: true
  },
  {
    id: 'checklist',
    title: 'Checklist',
    description: 'SWCM completion checklist (completed by SWCM)',
    required: false
  },
  {
    id: 'approval',
    title: 'Approval',
    description: 'Supervisor approval (completed by supervisor)',
    required: false
  }
]

export default function CaseSetupTracker({ case_, onProgressUpdate }: CaseSetupTrackerProps) {
  const [milestones, setMilestones] = useState<SetupMilestone[]>([])
  const [currentStep, setCurrentStep] = useState<string>('associations')
  const [loading, setLoading] = useState(false)

  // Load progress from localStorage
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(`case_setup_${case_.case_id}`)
      const completedIds = saved ? JSON.parse(saved).completedMilestones || [] : []
      
      const milestonesWithProgress = SETUP_STEPS.map(milestone => ({
        ...milestone,
        completed: completedIds.includes(milestone.id)
      }))
      
      setMilestones(milestonesWithProgress)
    } catch (error) {
      console.error('Error loading case setup progress:', error)
      setMilestones(SETUP_STEPS.map(m => ({ ...m, completed: false })))
    }
  }

  // Save progress to localStorage
  const saveProgress = (completedIds: string[]) => {
    try {
      const progressData: CaseSetupProgress = {
        caseId: case_.case_id,
        completedMilestones: completedIds,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem(`case_setup_${case_.case_id}`, JSON.stringify(progressData))
      
      if (onProgressUpdate) {
        onProgressUpdate()
      }
    } catch (error) {
      console.error('Error saving case setup progress:', error)
    }
  }

  // Handle step click
  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId)
    
    // Navigate to the appropriate tab and section based on the step
    switch (stepId) {
      case 'associations':
        // Navigate to People & Associations tab
        const peopleTab = document.querySelector('[data-tab="people"]') as HTMLButtonElement
        if (peopleTab) {
          peopleTab.click()
          // Wait for tab to load, then scroll to associations
          setTimeout(() => {
            const associationsSubTab = document.querySelector('[data-subtab="associations"]') as HTMLButtonElement
            if (associationsSubTab) {
              associationsSubTab.click()
            }
          }, 100)
        }
        break
        
      case 'living_arrangements':
        // Navigate to Case Management tab, Living Arrangements section
        const caseManagementTab = document.querySelector('[data-tab="case-management"]') as HTMLButtonElement
        if (caseManagementTab) {
          caseManagementTab.click()
          setTimeout(() => {
            const livingSubTab = document.querySelector('[data-subtab="living"]') as HTMLButtonElement
            if (livingSubTab) {
              livingSubTab.click()
            }
          }, 100)
        }
        break
        
      case 'services':
        // Navigate to Case Management tab, Services section
        const servicesTab = document.querySelector('[data-tab="case-management"]') as HTMLButtonElement
        if (servicesTab) {
          servicesTab.click()
          setTimeout(() => {
            const servicesSubTab = document.querySelector('[data-subtab="services"]') as HTMLButtonElement
            if (servicesSubTab) {
              servicesSubTab.click()
            }
          }, 100)
        }
        break
        
      case 'court':
        // Navigate to Legal & Documentation tab, Court section
        const legalTab = document.querySelector('[data-tab="legal"]') as HTMLButtonElement
        if (legalTab) {
          legalTab.click()
          setTimeout(() => {
            const courtSubTab = document.querySelector('[data-subtab="court"]') as HTMLButtonElement
            if (courtSubTab) {
              courtSubTab.click()
            }
          }, 100)
        }
        break
        
      default:
        // For disabled steps (checklist, approval), do nothing
        break
    }
  }

  // Toggle milestone completion
  const toggleMilestone = (milestoneId: string) => {
    setMilestones(prev => {
      const updated = prev.map(milestone => 
        milestone.id === milestoneId 
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      )
      
      // Save to localStorage
      const completedIds = updated.filter(m => m.completed).map(m => m.id)
      saveProgress(completedIds)
      
      return updated
    })
  }

  // Calculate progress
  const getProgress = () => {
    const completed = milestones.filter(m => m.completed).length
    const total = milestones.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  // Check if case setup is complete
  const isSetupComplete = () => {
    const requiredMilestones = milestones.filter(m => m.required)
    return requiredMilestones.every(m => m.completed)
  }

  // Handle complete setup
  const handleCompleteSetup = async () => {
    if (!isSetupComplete()) return
    
    setLoading(true)
    try {
      // Update case status to "Pending Approval" via API
      const response = await updateCase(case_.case_id, {
        status: 'Pending Approval'
      })
      
      if (response.error) {
        console.error('Error updating case status:', response.error)
        // Don't clear progress if API call failed
        return
      }
      
      // Clear the setup progress since it's complete
      localStorage.removeItem(`case_setup_${case_.case_id}`)
      
      if (onProgressUpdate) {
        onProgressUpdate()
      }
    } catch (error) {
      console.error('Error completing case setup:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProgress()
  }, [case_.case_id])

  const progress = getProgress()

  return (
    <div className="case-setup-tracker">
      <div className="setup-stepper">
        <ChevronStepper
          steps={milestones.map(milestone => ({
            id: milestone.id,
            title: milestone.title,
            completed: milestone.completed,
            disabled: milestone.id === 'checklist' || milestone.id === 'approval'
          }))}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="full-width"
        />
      </div>

      {/* Show content based on current step */}
      {case_.status === 'Case Setup' && (
        <div style={{ marginTop: 'var(--unit-6)' }}>
          {currentStep === 'associations' && (
            <div>
              <h3>Associations</h3>
              <p>Manage family associations and relationships for this case.</p>
            </div>
          )}
          {currentStep === 'living_arrangements' && (
            <div>
              <h3>Living Arrangements</h3>
              <p>Document current living arrangements for all children in this case.</p>
            </div>
          )}
          {currentStep === 'services' && (
            <div>
              <h3>Services</h3>
              <p>Set up and manage case services and support programs.</p>
            </div>
          )}
          {currentStep === 'court' && (
            <div>
              <h3>Court</h3>
              <p>Manage court information and legal documents for this case.</p>
            </div>
          )}
        </div>
      )}

      {isSetupComplete() && (
        <div className="setup-completion" style={{ marginTop: 'var(--unit-6)' }}>
          <div className="completion-message">
            <span className="icon">celebration</span>
            <h4>Case Setup Complete!</h4>
            <p>All required steps have been completed. You can now submit for supervisor review.</p>
          </div>
          <button
            onClick={handleCompleteSetup}
            className="action-btn primary large"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="icon">hourglass_empty</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="icon">send</span>
                Submit for Review
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
