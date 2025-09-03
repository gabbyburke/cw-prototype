'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Case, Person, updateCase } from '../lib/api'
import ChevronStepper from './ChevronStepper'
import MagicSearchModal from './MagicSearchModal'
import LivingArrangementsTable from './LivingArrangementsTable'

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
  const [showAddPersonForm, setShowAddPersonForm] = useState(false)
  const [addPersonType, setAddPersonType] = useState<'case-members' | 'relatives'>('case-members')
  const [newPersonData, setNewPersonData] = useState({
    first_name: '',
    last_name: '',
    role: 'Parent',
    state_id: ''
  })

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

  // Handle adding a person via form
  const handleAddPersonForm = (type: 'case-members' | 'relatives') => {
    setAddPersonType(type)
    setShowAddPersonForm(true)
    setNewPersonData({
      first_name: '',
      last_name: '',
      role: type === 'case-members' ? 'Parent' : 'Relative',
      state_id: ''
    })
  }

  // Handle person search
  const handlePersonSearch = (type: 'case-members' | 'relatives') => {
    setSearchModalType(type)
    setIsSearchModalOpen(true)
  }

  // Handle saving new person
  const handleSaveNewPerson = () => {
    // TODO: Add person to case
    console.log('Adding new person:', newPersonData, 'to type:', addPersonType)
    setShowAddPersonForm(false)
  }

  // Handle canceling add person form
  const handleCancelAddPerson = () => {
    setShowAddPersonForm(false)
    setNewPersonData({
      first_name: '',
      last_name: '',
      role: 'Parent',
      state_id: ''
    })
  }

  // Handle role change
  const handleRoleChange = (personId: string, newRole: string) => {
    // TODO: Update person role
    console.log('Updating role for person:', personId, 'to:', newRole)
  }

  // Handle retrieve state ID
  const handleRetrieveStateId = (personId: string) => {
    // TODO: Open DMV website or retrieve state ID
    console.log('Retrieving state ID for person:', personId)
    window.open('https://dmv.example.com', '_blank')
  }

  // Handle person selection from search modal
  const handlePersonSelected = (person: Person) => {
    // TODO: Add selected person to case with appropriate role
    console.log('Selected person:', person, 'for type:', searchModalType)
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

            <div className="associations-container">
              {/* Case Members Table */}
              <div className="association-box">
                <div className="box-header">
                  <h3>Case Members</h3>
                  <div className="header-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => handlePersonSearch('case-members')}
                    >
                      <span className="icon">person_add</span>
                      Add Person
                    </button>
                  </div>
                </div>

                {showAddPersonForm && addPersonType === 'case-members' && (
                  <div className="add-person-form">
                    <h4>Add New Person</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={newPersonData.first_name}
                          onChange={(e) => setNewPersonData({...newPersonData, first_name: e.target.value})}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={newPersonData.last_name}
                          onChange={(e) => setNewPersonData({...newPersonData, last_name: e.target.value})}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Role *</label>
                        <select
                          value={newPersonData.role}
                          onChange={(e) => setNewPersonData({...newPersonData, role: e.target.value})}
                        >
                          <option value="Parent">Parent</option>
                          <option value="Non-Resident Parent">Non-Resident Parent</option>
                          <option value="Client">Client</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Relative">Relative</option>
                          <option value="Family Support">Family Support</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>State ID</label>
                        <input
                          type="text"
                          value={newPersonData.state_id}
                          onChange={(e) => setNewPersonData({...newPersonData, state_id: e.target.value})}
                          placeholder="Enter state ID"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button onClick={handleSaveNewPerson} className="action-btn primary">
                        <span className="icon">save</span>
                        Save Person
                      </button>
                      <button onClick={handleCancelAddPerson} className="action-btn secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="people-table">
                  {getCaseMembers().length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>State ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCaseMembers().map((person) => (
                          <tr key={person.person_id}>
                            <td>
                              <div className="person-name">
                                {person.role === 'Alleged Perpetrator' && (
                                  <span className="perpetrator-flag icon" title="Perpetrator">flag</span>
                                )}
                                <strong>{person.first_name} {person.last_name}</strong>
                              </div>
                            </td>
                            <td>
                              <select
                                value={person.role}
                                onChange={(e) => handleRoleChange(person.person_id, e.target.value)}
                                className="role-dropdown"
                              >
                                <option value="Parent">Parent</option>
                                <option value="Non-Resident Parent">Non-Resident Parent</option>
                                <option value="Client">Client</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Relative">Relative</option>
                                <option value="Family Support">Family Support</option>
                              </select>
                            </td>
                            <td>
                              <div className="state-id-cell">
                                {(person as any).state_id ? (
                                  <span className="state-id">{(person as any).state_id}</span>
                                ) : (
                                  <button 
                                    className="action-btn small secondary"
                                    onClick={() => handleRetrieveStateId(person.person_id)}
                                  >
                                    <span className="icon">search</span>
                                    Retrieve State ID
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <span className="icon">people</span>
                      <p>No case members added yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Family Supports Table */}
              <div className="association-box">
                <div className="box-header">
                  <h3>Family Supports</h3>
                  <div className="header-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => handlePersonSearch('relatives')}
                    >
                      <span className="icon">person_add</span>
                      Add Person
                    </button>
                  </div>
                </div>

                {showAddPersonForm && addPersonType === 'relatives' && (
                  <div className="add-person-form">
                    <h4>Add New Person</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={newPersonData.first_name}
                          onChange={(e) => setNewPersonData({...newPersonData, first_name: e.target.value})}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={newPersonData.last_name}
                          onChange={(e) => setNewPersonData({...newPersonData, last_name: e.target.value})}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Role *</label>
                        <select
                          value={newPersonData.role}
                          onChange={(e) => setNewPersonData({...newPersonData, role: e.target.value})}
                        >
                          <option value="Relative">Relative</option>
                          <option value="Family Support">Family Support</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>State ID</label>
                        <input
                          type="text"
                          value={newPersonData.state_id}
                          onChange={(e) => setNewPersonData({...newPersonData, state_id: e.target.value})}
                          placeholder="Enter state ID"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button onClick={handleSaveNewPerson} className="action-btn primary">
                        <span className="icon">save</span>
                        Save Person
                      </button>
                      <button onClick={handleCancelAddPerson} className="action-btn secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="people-table">
                  {getRelatives().length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>State ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRelatives().map((person) => (
                          <tr key={person.person_id}>
                            <td>
                              <strong>{person.first_name} {person.last_name}</strong>
                            </td>
                            <td>
                              <select
                                value={person.role}
                                onChange={(e) => handleRoleChange(person.person_id, e.target.value)}
                                className="role-dropdown"
                              >
                                <option value="Relative">Relative</option>
                                <option value="Family Support">Family Support</option>
                              </select>
                            </td>
                            <td>
                              <div className="state-id-cell">
                                {(person as any).state_id ? (
                                  <span className="state-id">{(person as any).state_id}</span>
                                ) : (
                                  <button 
                                    className="action-btn small secondary"
                                    onClick={() => handleRetrieveStateId(person.person_id)}
                                  >
                                    <span className="icon">search</span>
                                    Retrieve State ID
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <span className="icon">family_restroom</span>
                      <p>No family supports added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'living_arrangements' && (
          <div className="living-arrangements-step">
            <LivingArrangementsTable case_={case_} />
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
        onSelectPerson={handlePersonSelected}
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
          width: 160px;
          flex-shrink: 0;
          margin-left: auto;
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

        .associations-container {
          display: flex;
          flex-direction: column;
          gap: var(--unit-6);
        }

        .header-actions {
          display: flex;
          gap: var(--unit-2);
        }

        .add-person-form {
          background-color: var(--surface-container);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-3);
          padding: var(--unit-4);
          margin-bottom: var(--unit-4);
        }

        .add-person-form h4 {
          margin: 0 0 var(--unit-3) 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--on-surface);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--unit-3);
          margin-bottom: var(--unit-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--unit-1);
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--on-surface-variant);
        }

        .form-group input,
        .form-group select {
          padding: var(--unit-2);
          border: 1px solid var(--outline-variant);
          border-radius: var(--unit-1);
          background-color: var(--surface);
          color: var(--on-surface);
          font-size: 0.875rem;
          font-family: var(--font);
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
        }

        .form-actions {
          display: flex;
          gap: var(--unit-2);
          justify-content: flex-end;
        }

        .people-table {
          margin-top: var(--unit-4);
        }

        .people-table .data-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--surface);
          border-radius: var(--unit-2);
          overflow: hidden;
        }

        .people-table .data-table th {
          background-color: var(--surface-container);
          color: var(--on-surface-variant);
          font-weight: 600;
          text-align: left;
          padding: var(--unit-3);
          border-bottom: 1px solid var(--outline-variant);
          font-size: 0.875rem;
        }

        .people-table .data-table td {
          padding: var(--unit-3);
          border-bottom: 1px solid var(--outline-variant);
          color: var(--on-surface);
          vertical-align: top;
        }

        .people-table .data-table tr:hover {
          background-color: var(--surface-container-low);
        }

        .person-name {
          display: flex;
          align-items: center;
          gap: var(--unit-2);
        }

        .perpetrator-flag {
          font-family: var(--font-icon);
          color: var(--error);
          font-size: 1rem;
        }

        .role-dropdown {
          width: 100%;
          min-width: 150px;
        }

        .state-id-cell {
          display: flex;
          align-items: center;
        }

        .state-id {
          font-family: monospace;
          font-weight: 600;
          color: var(--on-surface);
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
