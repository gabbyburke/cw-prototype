'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, Person, updateCase } from '../lib/api'
import ChevronStepper from './ChevronStepper'
import MagicSearchModal from './MagicSearchModal'

interface CaseSetupViewProps {
  case_: Case
  onProgressUpdate?: () => void
}

interface SetupMilestone {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
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

export default function CaseSetupView({ case_, onProgressUpdate }: CaseSetupViewProps) {
  const [milestones, setMilestones] = useState<SetupMilestone[]>([])
  const [currentStep, setCurrentStep] = useState<string>('associations')
  const [loading, setLoading] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchModalType, setSearchModalType] = useState<'case-members' | 'relatives'>('case-members')

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
      const progressData = {
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
  }

  // Get case members (people with formal roles in the case)
  const getCaseMembers = () => {
    if (!case_.persons) return []
    return case_.persons.filter(person => 
      ['Client', 'Parent', 'Guardian', 'Caregiver', 'Alleged Perpetrator'].includes(person.role)
    )
  }

  // Get relatives/family supports (people with supportive roles)
  const getRelatives = () => {
    if (!case_.persons) return []
    return case_.persons.filter(person => 
      ['Relative', 'Family Friend', 'Support Person', 'Emergency Contact'].includes(person.role)
    )
  }

  // Handle adding a person
  const handleAddPerson = (type: 'case-members' | 'relatives') => {
    setSearchModalType(type)
    setIsSearchModalOpen(true)
  }

  // Handle incident selection from search modal
  const handleIncidentSelected = (incident: any) => {
    // TODO: Extract person data from incident and add to case
    console.log('Selected incident:', incident, 'for type:', searchModalType)
    setIsSearchModalOpen(false)
  }

  // Handle removing a person
  const handleRemovePerson = (personId: string) => {
    // TODO: Remove person from case
    console.log('Remove person:', personId)
  }

  // Handle editing a person
  const handleEditPerson = (person: Person) => {
    // TODO: Open edit modal for person
    console.log('Edit person:', person)
  }

  useEffect(() => {
    loadProgress()
  }, [case_.case_id])

  return (
    <div className="case-setup-view">
      {/* Header */}
      <div className="setup-header">
        <div className="header-content">
          <div className="case-info">
            <h1>{case_.case_display_name || case_.family_name}</h1>
            <p>{case_.case_number} • Case Setup</p>
          </div>
          <Link href="/" className="action-btn secondary">
            <span className="icon">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Chevron Stepper */}
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

      {/* Step Content */}
      <div className="setup-content">
        {currentStep === 'associations' && (
          <div className="associations-step">
            <div className="step-header">
              <h2>Associations</h2>
              <p>Manage family associations and relationships for this case.</p>
            </div>

            <div className="associations-grid">
              {/* Case Members Box */}
              <div className="association-box">
                <div className="box-header">
                  <h3>Case Members</h3>
                  <button 
                    className="action-btn primary"
                    onClick={() => handleAddPerson('case-members')}
                  >
                    <span className="icon">person_add</span>
                    Add Person
                  </button>
                </div>
                <div className="people-list">
                  {getCaseMembers().map((person) => (
                    <div key={person.person_id} className="person-item">
                      <div className="person-info">
                        <strong>{person.first_name} {person.last_name}</strong>
                        <span className="person-role">{person.role}</span>
                      </div>
                      <div className="person-actions">
                        <button 
                          className="action-btn small secondary"
                          onClick={() => handleEditPerson(person)}
                        >
                          <span className="icon">edit</span>
                          Edit
                        </button>
                        <button 
                          className="action-btn small error"
                          onClick={() => handleRemovePerson(person.person_id)}
                        >
                          <span className="icon">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {getCaseMembers().length === 0 && (
                    <div className="empty-state">
                      <span className="icon">people</span>
                      <p>No case members added yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Relatives/Family Supports Box */}
              <div className="association-box">
                <div className="box-header">
                  <h3>Relatives/Family Supports</h3>
                  <button 
                    className="action-btn primary"
                    onClick={() => handleAddPerson('relatives')}
                  >
                    <span className="icon">person_add</span>
                    Add Person
                  </button>
                </div>
                <div className="people-list">
                  {getRelatives().map((person) => (
                    <div key={person.person_id} className="person-item">
                      <div className="person-info">
                        <strong>{person.first_name} {person.last_name}</strong>
                        <span className="person-role">{person.role}</span>
                      </div>
                      <div className="person-actions">
                        <button 
                          className="action-btn small secondary"
                          onClick={() => handleEditPerson(person)}
                        >
                          <span className="icon">edit</span>
                          Edit
                        </button>
                        <button 
                          className="action-btn small error"
                          onClick={() => handleRemovePerson(person.person_id)}
                        >
                          <span className="icon">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {getRelatives().length === 0 && (
                    <div className="empty-state">
                      <span className="icon">family_restroom</span>
                      <p>No relatives or family supports added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'living_arrangements' && (
          <div className="living-arrangements-step">
            <div className="step-header">
              <h2>Living Arrangements</h2>
              <p>Document current living arrangements for all children in this case.</p>
            </div>
            <div className="placeholder-content">
              <p>Living arrangements content will be implemented next.</p>
            </div>
          </div>
        )}

        {currentStep === 'services' && (
          <div className="services-step">
            <div className="step-header">
              <h2>Services</h2>
              <p>Set up and manage case services and support programs.</p>
            </div>
            <div className="placeholder-content">
              <p>Services content will be implemented next.</p>
            </div>
          </div>
        )}

        {currentStep === 'court' && (
          <div className="court-step">
            <div className="step-header">
              <h2>Court</h2>
              <p>Manage court information and legal documents for this case.</p>
            </div>
            <div className="placeholder-content">
              <p>Court content will be implemented next.</p>
            </div>
          </div>
        )}
      </div>

      {/* Magic Search Modal */}
      <MagicSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectIncident={handleIncidentSelected}
      />

      <style jsx>{`
        .case-setup-view {
          min-height: 100vh;
          background-color: var(--background);
        }

        .setup-header {
          padding: var(--unit-4) var(--unit-6);
          border-bottom: 1px solid var(--outline-variant);
          background-color: var(--surface);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content .action-btn {
          width: auto;
          min-width: 160px;
          max-width: 200px;
          flex-shrink: 0;
        }

        .case-info h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .case-info p {
          margin: 4px 0 0 0;
          font-size: 0.875rem;
          color: var(--on-surface-variant);
        }

        .setup-stepper {
          padding: var(--unit-4) var(--unit-6);
          background-color: var(--surface-container-low);
          border-bottom: 1px solid var(--outline-variant);
        }

        .setup-content {
          padding: var(--unit-6);
        }

        .step-header {
          margin-bottom: var(--unit-6);
        }

        .step-header h2 {
          margin: 0 0 var(--unit-2) 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .step-header p {
          margin: 0;
          font-size: 1rem;
          color: var(--on-surface-variant);
        }

        .associations-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--unit-6);
        }

        .association-box {
          background-color: var(--surface-container-low);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-3);
          padding: var(--unit-5);
        }

        .box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--unit-4);
        }

        .box-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .box-header .action-btn {
          width: auto;
          min-width: 120px;
          max-width: 150px;
          flex-shrink: 0;
        }

        .people-list {
          display: flex;
          flex-direction: column;
          gap: var(--unit-3);
        }

        .person-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--unit-3);
          background-color: var(--surface);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-2);
        }

        .person-info {
          display: flex;
          flex-direction: column;
          gap: var(--unit-1);
        }

        .person-info strong {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .person-role {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .person-actions {
          display: flex;
          gap: var(--unit-2);
        }

        .person-actions .action-btn {
          width: auto;
          min-width: 70px;
          max-width: 90px;
          flex-shrink: 0;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--unit-3);
          padding: var(--unit-6);
          color: var(--on-surface-variant);
          text-align: center;
        }

        .empty-state .icon {
          font-family: var(--font-icon);
          font-size: 2rem;
          color: var(--outline);
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        .placeholder-content {
          text-align: center;
          padding: var(--unit-8);
          color: var(--on-surface-variant);
        }

        @media (max-width: 768px) {
          .associations-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: var(--unit-3);
            align-items: stretch;
          }

          .header-content .action-btn {
            width: 100%;
            max-width: none;
          }
          
          .person-item {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--unit-3);
          }
          
          .person-actions {
            align-self: flex-end;
          }

          .box-header .action-btn {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </div>
  )
}
