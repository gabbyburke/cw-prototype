'use client'

import { useState, useEffect } from 'react'
import { Case, Person, updateCase, searchPersons } from '../lib/api'
import MagicSearchModal from './MagicSearchModal'

interface RequestSWCMAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  case_: Case | null
  onSuccess: () => void
}

interface SetupStep {
  id: number
  title: string
  description: string
  completed: boolean
}

interface SavedSetupData {
  caseId: string
  currentStep: number
  casePersons: Person[]
  allegations: {
    type: string
    description: string
  }
  assessments: {
    risk_level: 'Low' | 'Medium' | 'High' | 'Very High'
    safety_factors: string[]
    assessment_notes: string
    risk_confirmed: boolean
    safety_confirmed: boolean
  }
  finalConfirmation: {
    cpw_notes: string
    ready_for_assignment: boolean
  }
  lastSaved: string
}

export default function RequestSWCMAssignmentModal({ isOpen, onClose, case_, onSuccess }: RequestSWCMAssignmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Step 1: Case membership
  const [casePersons, setCasePersons] = useState<Person[]>([])
  const [showAddPersonForm, setShowAddPersonForm] = useState(false)
  const [showPersonSearch, setShowPersonSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'Parent' | 'Non-Resident Parent' | 'Client' | 'Guardian' | 'Relative' | 'Family Support'>('Parent')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [newPersonData, setNewPersonData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    role: 'Parent' as 'Parent' | 'Non-Resident Parent' | 'Client' | 'Guardian' | 'Relative' | 'Family Support'
  })
  
  // Step 2: Allegations
  const [allegations, setAllegations] = useState({
    type: '',
    description: ''
  })
  
  // Step 3: Assessments
  const [assessments, setAssessments] = useState({
    risk_level: 'Medium' as 'Low' | 'Medium' | 'High' | 'Very High',
    safety_factors: [] as string[],
    assessment_notes: '',
    risk_confirmed: false,
    safety_confirmed: false
  })
  
  // Common safety factors for quick selection
  const commonSafetyFactors = [
    'Physical injury to child',
    'Sexual abuse allegation',
    'Domestic violence',
    'Substance abuse concerns',
    'Inadequate supervision',
    'Unsafe living conditions',
    'Mental health concerns',
    'Medical neglect',
    'Educational neglect',
    'Child disclosure',
    'Perpetrator has access',
    'Young child age',
    'Chronic health conditions'
  ]
  
  const [newSafetyFactor, setNewSafetyFactor] = useState('')
  
  // Step 4: Final confirmation
  const [finalConfirmation, setFinalConfirmation] = useState({
    cpw_notes: '',
    ready_for_assignment: false
  })

  const steps: SetupStep[] = [
    {
      id: 1,
      title: 'Review Case Details',
      description: 'Name case, add safety concerns, and review case information',
      completed: allegations.type !== '' && allegations.description !== ''
    },
    {
      id: 2,
      title: 'Verify Case Membership',
      description: 'Review and add people involved in the case',
      completed: casePersons.length > 0
    },
    {
      id: 3,
      title: 'Update Living Arrangements',
      description: 'Set living arrangements for all children/clients',
      completed: assessments.risk_confirmed && assessments.safety_confirmed
    },
    {
      id: 4,
      title: 'Request SWCM Assignment',
      description: 'Finalize case setup and request SWCM',
      completed: finalConfirmation.ready_for_assignment
    }
  ]

  // Save/Resume functionality
  const getStorageKey = (caseId: string) => `cpw_assignment_${caseId}`

  const saveProgress = () => {
    if (!case_) return

    const savedData: SavedSetupData = {
      caseId: case_.case_id,
      currentStep,
      casePersons,
      allegations,
      assessments,
      finalConfirmation,
      lastSaved: new Date().toISOString()
    }

    localStorage.setItem(getStorageKey(case_.case_id), JSON.stringify(savedData))
  }

  const loadSavedProgress = (caseId: string): SavedSetupData | null => {
    try {
      const saved = localStorage.getItem(getStorageKey(caseId))
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Error loading saved progress:', error)
      return null
    }
  }

  const clearSavedProgress = (caseId: string) => {
    localStorage.removeItem(getStorageKey(caseId))
  }

  useEffect(() => {
    if (isOpen && case_) {
      // Check for saved progress first
      const savedProgress = loadSavedProgress(case_.case_id)
      
      if (savedProgress) {
        // Restore saved progress
        setCurrentStep(savedProgress.currentStep)
        setCasePersons(savedProgress.casePersons)
        setAllegations(savedProgress.allegations)
        setAssessments(savedProgress.assessments)
        setFinalConfirmation(savedProgress.finalConfirmation)
      } else {
        // Initialize data from case
        setCasePersons(case_.persons || [])
        setAllegations({
          type: case_.allegation_type || '',
          description: case_.allegation_description || ''
        })
        setAssessments({
          risk_level: (case_.risk_level as 'Low' | 'Medium' | 'High' | 'Very High') || 'Medium',
          safety_factors: case_.safety_factors || [],
          assessment_notes: case_.assessment_notes || '',
          risk_confirmed: false,
          safety_confirmed: false
        })
        setFinalConfirmation({
          cpw_notes: '',
          ready_for_assignment: false
        })
        setCurrentStep(1)
      }
      setError(null)
    }
  }, [isOpen, case_])

  // Auto-save progress when data changes (but only save to localStorage, not to API)
  useEffect(() => {
    if (isOpen && case_) {
      const timeoutId = setTimeout(() => {
        saveProgress() // This only saves to localStorage, not to the API
      }, 1000) // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [isOpen, case_, currentStep, casePersons, allegations, assessments, finalConfirmation])

  const handleAddPerson = () => {
    if (!newPersonData.first_name || !newPersonData.last_name) {
      setError('First name and last name are required')
      return
    }

    const newPerson: Person = {
      person_id: `temp_${Date.now()}`,
      first_name: newPersonData.first_name,
      last_name: newPersonData.last_name,
      date_of_birth: newPersonData.date_of_birth,
      role: newPersonData.role.toLowerCase(),
      contact_info: {
        phone: undefined,
        email: undefined,
        address: undefined
      },
      indicators: [],
      relationship_to_primary_child: newPersonData.role
    }

    setCasePersons([...casePersons, newPerson])
    setNewPersonData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      role: 'Parent'
    })
    setShowAddPersonForm(false)
    setError(null)
  }

  const handleRemovePerson = (personId: string) => {
    setCasePersons(casePersons.filter(p => p.person_id !== personId))
  }

  // Person search functionality
  const handleSearchPersons = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await searchPersons(query)
      if (response.error) {
        setError(response.error)
        setSearchResults([])
      } else if (response.data) {
        setSearchResults(response.data.persons)
      }
    } catch (err) {
      setError('Failed to search persons')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleAddExistingPerson = (person: Person) => {
    // Check if person is already in the case
    if (casePersons.some(p => p.person_id === person.person_id)) {
      setError('This person is already added to the case')
      return
    }

    // Add person with selected role
    const personWithRole: Person = {
      ...person,
      role: selectedRole.toLowerCase(),
      relationship_to_primary_child: selectedRole
    }

    setCasePersons([...casePersons, personWithRole])
    setShowPersonSearch(false)
    setSearchQuery('')
    setSearchResults([])
    setError(null)
  }

  // Debounced search
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        handleSearchPersons(searchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinishSetup = async () => {
    if (!case_) return

    setLoading(true)
    setError(null)

    try {
      // Update case with final data and change status to "Pending Assignment"
      const updates = {
        allegation_type: allegations.type,
        allegation_description: allegations.description,
        risk_level: assessments.risk_level,
        safety_factors: assessments.safety_factors,
        assessment_notes: assessments.assessment_notes,
        status: 'Pending Assignment'
      }

      const response = await updateCase(case_.case_id, updates)
      
      if (response.error) {
        setError(response.error)
      } else {
        // Clear saved progress since setup is complete
        clearSavedProgress(case_.case_id)
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError('Failed to request SWCM assignment')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !case_) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container large scrollable" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
        <div className="modal-header">
          <h2>Request SWCM Assignment - {case_.case_display_name || `Case ${case_.case_id}`}</h2>
          <button onClick={onClose} className="modal-close">
            <span className="icon">close</span>
          </button>
        </div>

        <div className="modal-body">
          {/* Compact Step Navigation */}
          <div className="compact-step-nav">
            {steps.map((step) => (
              <button
                key={step.id}
                className={`compact-step ${currentStep === step.id ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="step-number">
                  {step.completed ? <span className="icon">check</span> : step.id}
                </div>
                <span className="step-title">{step.title}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message">
              <span className="icon">error</span>
              {error}
            </div>
          )}

          {/* Step 1: Review Case Details */}
          {currentStep === 1 && (
            <div className="setup-step">
              <h3>Step 1: Review Case Details</h3>
              <p>Name this case, add family safety concerns, and review case information before requesting SWCM assignment.</p>
              
              <div className="form-group">
                <label>Name this case *</label>
                <input
                  type="text"
                  value={allegations.description}
                  onChange={(e) => setAllegations({...allegations, description: e.target.value})}
                  placeholder="Enter a descriptive name for this case..."
                />
              </div>
              
              <div className="form-group">
                <label>Add family safety concerns</label>
                <textarea
                  value={assessments.assessment_notes}
                  onChange={(e) => setAssessments({...assessments, assessment_notes: e.target.value})}
                  placeholder="Describe any family safety concerns..."
                  rows={3}
                />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Safety Plan</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="safety_plan"
                        value="yes"
                        checked={assessments.safety_factors.includes('Safety Plan Required')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: [...assessments.safety_factors.filter(f => !f.includes('Safety Plan')), 'Safety Plan Required']
                            })
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="safety_plan"
                        value="no"
                        checked={!assessments.safety_factors.includes('Safety Plan Required')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: assessments.safety_factors.filter(f => !f.includes('Safety Plan'))
                            })
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Family Preservation</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="family_preservation"
                        value="yes"
                        checked={assessments.safety_factors.includes('Family Preservation Services')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: [...assessments.safety_factors.filter(f => !f.includes('Family Preservation')), 'Family Preservation Services']
                            })
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="family_preservation"
                        value="no"
                        checked={!assessments.safety_factors.includes('Family Preservation Services')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: assessments.safety_factors.filter(f => !f.includes('Family Preservation'))
                            })
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Prior Service Case</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="prior_service"
                        value="yes"
                        checked={assessments.safety_factors.includes('Prior Service Case')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: [...assessments.safety_factors.filter(f => !f.includes('Prior Service')), 'Prior Service Case']
                            })
                          }
                        }}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="prior_service"
                        value="no"
                        checked={!assessments.safety_factors.includes('Prior Service Case')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssessments({
                              ...assessments,
                              safety_factors: assessments.safety_factors.filter(f => !f.includes('Prior Service'))
                            })
                          }
                        }}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Service Area Assigned</label>
                  <input
                    type="text"
                    value={allegations.type}
                    onChange={(e) => setAllegations({...allegations, type: e.target.value})}
                    placeholder="Will be pre-filled from Magic Button"
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label>Residence County</label>
                  <input
                    type="text"
                    value={case_?.county || ''}
                    placeholder="Will be pre-filled from Magic Button"
                    disabled
                  />
                </div>
                
                <div className="form-group">
                  <label>Financial County</label>
                  <input
                    type="text"
                    value={case_?.county || ''}
                    placeholder="Will be pre-filled from Magic Button"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Case Membership */}
          {currentStep === 2 && (
            <div className="setup-step">
              <h3>Step 2: Verify Case Membership</h3>
              <p>Review the people involved in this case and add any missing individuals before assignment.</p>
              
              <div className="persons-list">
                {casePersons.map((person) => (
                  <div key={person.person_id} className="person-item">
                    <div className="person-info">
                      <strong>{person.first_name} {person.last_name}</strong>
                      <span className="person-role">{person.role}</span>
                      {person.date_of_birth && (
                        <span className="person-age">
                          Age: {Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemovePerson(person.person_id)}
                      className="action-btn small error"
                    >
                      <span className="icon">remove</span>
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="person-search-section">
                <div className="form-group">
                  <label>Search for a person or add new</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Start typing a person's name..."
                  />
                </div>

                {searchLoading && (
                  <div className="search-loading">
                    <span className="icon">hourglass_empty</span>
                    Searching...
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="search-results">
                    <h5>Found {searchResults.length} person(s)</h5>
                    {searchResults.map((person) => (
                      <div key={person.person_id} className="search-result-item">
                        <div className="person-info">
                          <strong>{person.first_name} {person.last_name}</strong>
                          {person.date_of_birth && (
                            <span className="person-age">
                              Age: {Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                            </span>
                          )}
                          {person.contact_info?.address && (
                            <span className="person-address">{person.contact_info.address}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => {
                            if (!casePersons.some(p => p.person_id === person.person_id)) {
                              setShowPersonSearch(true)
                              setSelectedRole('Parent')
                              // Store the selected person for role assignment
                              setSelectedPerson(person)
                            }
                          }}
                          className="action-btn small primary"
                          disabled={casePersons.some(p => p.person_id === person.person_id)}
                        >
                          {casePersons.some(p => p.person_id === person.person_id) ? 'Already Added' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
                  <div className="no-results">
                    <div className="no-results-content">
                      <span className="icon">search_off</span>
                      <p>No persons found matching "{searchQuery}"</p>
                      <button 
                        onClick={() => setShowAddPersonForm(true)}
                        className="action-btn primary"
                      >
                        <span className="icon">person_add</span>
                        Add "{searchQuery}" as New Person
                      </button>
                    </div>
                  </div>
                )}

                {searchQuery.length === 0 && (
                  <div className="search-help">
                    <p>Start typing to search for existing people, or</p>
                    <button 
                      onClick={() => setShowAddPersonForm(true)}
                      className="action-btn secondary"
                    >
                      <span className="icon">person_add</span>
                      Add New Person
                    </button>
                  </div>
                )}
              </div>

              {showPersonSearch && selectedPerson && (
                <div className="role-selection-form">
                  <h4>Select Role for {selectedPerson.first_name} {selectedPerson.last_name}</h4>
                  <div className="form-group">
                    <label>Role in Case</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                    >
                      <option value="Parent">Parent</option>
                      <option value="Non-Resident Parent">Non-Resident Parent</option>
                      <option value="Client">Client</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Relative">Relative</option>
                      <option value="Family Support">Family Support</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button 
                      onClick={() => {
                        handleAddExistingPerson(selectedPerson)
                        setShowPersonSearch(false)
                        setSelectedPerson(null)
                      }}
                      className="action-btn primary"
                    >
                      <span className="icon">add</span>
                      Add to Case
                    </button>
                    <button 
                      onClick={() => {
                        setShowPersonSearch(false)
                        setSelectedPerson(null)
                      }} 
                      className="action-btn secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showAddPersonForm && (
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
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={newPersonData.date_of_birth}
                        onChange={(e) => setNewPersonData({...newPersonData, date_of_birth: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Relationship to Case *</label>
                      <select
                        value={newPersonData.role}
                        onChange={(e) => setNewPersonData({...newPersonData, role: e.target.value as any})}
                      >
                        <option value="Parent">Parent</option>
                        <option value="Non-Resident Parent">Non-Resident Parent</option>
                        <option value="Client">Client</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Relative">Relative</option>
                        <option value="Family Support">Family Support</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button onClick={handleAddPerson} className="action-btn primary">
                      <span className="icon">add</span>
                      Add Person
                    </button>
                    <button 
                      onClick={() => setShowAddPersonForm(false)} 
                      className="action-btn secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Update Living Arrangements */}
          {currentStep === 3 && (
            <div className="setup-step">
              <h3>Step 3: Update Living Arrangements</h3>
              <p>Set living arrangements for all children/clients before requesting SWCM assignment.</p>
              
              <div className="living-arrangements-section">
                {casePersons.filter(person => person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child').length > 0 ? (
                  casePersons
                    .filter(person => person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child')
                    .map((child) => (
                      <div key={child.person_id} className="child-living-arrangement">
                        <h4>{child.first_name} {child.last_name}</h4>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Living Arrangement Type *</label>
                            <select
                              value=""
                              onChange={(e) => {
                                // TODO: Store living arrangement data
                                console.log(`Living arrangement for ${child.first_name}: ${e.target.value}`)
                              }}
                            >
                              <option value="">Select arrangement type</option>
                              <option value="With Parent/Guardian">With Parent/Guardian</option>
                              <option value="Foster Care">Foster Care</option>
                              <option value="Kinship Care">Kinship Care</option>
                              <option value="Group Home">Group Home</option>
                              <option value="Residential Treatment">Residential Treatment</option>
                              <option value="Independent Living">Independent Living</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label>Name and Location *</label>
                            <input
                              type="text"
                              placeholder="Enter caregiver name and location"
                              onChange={(e) => {
                                // TODO: Store location data
                                console.log(`Location for ${child.first_name}: ${e.target.value}`)
                              }}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Start Date *</label>
                            <input
                              type="date"
                              onChange={(e) => {
                                // TODO: Store start date
                                console.log(`Start date for ${child.first_name}: ${e.target.value}`)
                              }}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>End Date</label>
                            <input
                              type="date"
                              onChange={(e) => {
                                // TODO: Store end date
                                console.log(`End date for ${child.first_name}: ${e.target.value}`)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="no-children-notice">
                    <span className="icon">info</span>
                    <p>No children/clients found in this case. Please add children in Step 2 before requesting assignment.</p>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={assessments.risk_confirmed}
                    onChange={(e) => setAssessments({...assessments, risk_confirmed: e.target.checked})}
                  />
                  I confirm all living arrangements have been reviewed and updated
                </label>
              </div>
            </div>
          )}


          {/* Step 4: Final Confirmation */}
          {currentStep === 4 && (
            <div className="setup-step">
              <h3>Step 4: Request SWCM Assignment</h3>
              <p>Review all information and request assignment to a Social Work Case Manager.</p>
              
              <div className="setup-summary">
                <h4>Assignment Request Summary</h4>
                <div className="summary-item">
                  <strong>People Involved:</strong> {casePersons.length} person(s)
                </div>
                <div className="summary-item">
                  <strong>Allegation:</strong> {allegations.type}
                </div>
                <div className="summary-item">
                  <strong>Risk Level:</strong> {assessments.risk_level}
                </div>
                <div className="summary-item">
                  <strong>Ready for Assignment:</strong> {assessments.risk_confirmed ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="form-group">
                <label>CPW Notes (Optional)</label>
                <textarea
                  value={finalConfirmation.cpw_notes}
                  onChange={(e) => setFinalConfirmation({...finalConfirmation, cpw_notes: e.target.value})}
                  placeholder="Add any additional notes for the SWCM..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={finalConfirmation.ready_for_assignment}
                    onChange={(e) => setFinalConfirmation({...finalConfirmation, ready_for_assignment: e.target.checked})}
                  />
                  I confirm this case is ready for SWCM assignment and all required information has been reviewed
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button onClick={onClose} className="action-btn secondary">
              Cancel
            </button>
            
            {currentStep > 1 && (
              <button onClick={handlePreviousStep} className="action-btn secondary">
                <span className="icon">arrow_back</span>
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button 
                onClick={handleNextStep} 
                className="action-btn primary"
              >
                Next
                <span className="icon">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={handleFinishSetup} 
                className="action-btn primary"
                disabled={!finalConfirmation.ready_for_assignment || loading}
              >
                {loading ? 'Requesting Assignment...' : 'Request SWCM Assignment'}
                <span className="icon">assignment_ind</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
