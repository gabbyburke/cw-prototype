'use client'

import { useState, useEffect } from 'react'
import { Case, Person, updateCase, searchPersons, MagicButtonData } from '@/lib/api'
import MagicSearchModal from './MagicSearchModal'
import LivingArrangementsTable from './LivingArrangementsTable'

interface RequestSWCMAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  case_: Case | null
  incident?: MagicButtonData | null
  onSuccess: () => void
}

interface ChildDetails {
  [personId: string]: {
    safeHaven: boolean
    nativeAmericanHeritage: boolean
    voluntaryPlacementAgreement: boolean
    allergies: boolean
    courtInvolved: boolean
    infantAffectedBySubstances: boolean
    sexTraffickingVictim: boolean
  }
}

export default function RequestSWCMAssignmentModal({ isOpen, onClose, case_, incident, onSuccess }: RequestSWCMAssignmentModalProps) {
  const [activeTab, setActiveTab] = useState<'review-case' | 'review-living'>('review-case')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Case name
  const [caseName, setCaseName] = useState('')
  
  // Case membership
  const [casePersons, setCasePersons] = useState<Person[]>([])
  const [showAddPersonForm, setShowAddPersonForm] = useState(false)
  const [showPersonSearch, setShowPersonSearch] = useState(false)
  const [searchModalType, setSearchModalType] = useState<'case-members' | 'relatives'>('case-members')
  const [addPersonType, setAddPersonType] = useState<'case-members' | 'relatives'>('case-members')
  const [newPersonData, setNewPersonData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    role: 'Parent' as 'Parent' | 'Non-Resident Parent' | 'Client' | 'Guardian' | 'Relative' | 'Family Support'
  })
  
  // Child details
  const [childDetails, setChildDetails] = useState<ChildDetails>({})

  useEffect(() => {
    if (isOpen && case_) {
      // Initialize data from case (assuming most data comes from magic button)
      setCaseName(case_.case_display_name || '')
      
      // Start with persons from case
      let allPersons = [...(case_.persons || [])]
      
      // If we have incident data, add additional people from magic button
      if (incident) {
        const additionalPersons: Person[] = []
        
        // Add parent if not already in case
        if (incident.parent_first_names && incident.parent_last_names) {
          const parentExists = allPersons.some(p => 
            p.first_name === incident.parent_first_names && 
            p.last_name === incident.parent_last_names
          )
          
          if (!parentExists) {
            additionalPersons.push({
              person_id: `${incident.incident_number}-parent`,
              first_name: incident.parent_first_names,
              last_name: incident.parent_last_names,
              date_of_birth: '',
              role: 'parent',
              contact_info: {
                phone: incident.phone_number || '',
                address: incident.current_address || incident.address || ''
              },
              indicators: [],
              relationship_to_primary_child: 'Parent'
            })
          }
        }
        
        // Add non-custodial parent if exists
        if (incident.non_custodial_parent && incident.non_custodial_parent_first_name && incident.non_custodial_parent_last_name) {
          const nonCustodialExists = allPersons.some(p => 
            p.first_name === incident.non_custodial_parent_first_name && 
            p.last_name === incident.non_custodial_parent_last_name
          )
          
          if (!nonCustodialExists) {
            additionalPersons.push({
              person_id: incident.non_custodial_parent_person_id || `${incident.incident_number}-ncp`,
              first_name: incident.non_custodial_parent_first_name,
              last_name: incident.non_custodial_parent_last_name,
              date_of_birth: incident.non_custodial_parent_dob || '',
              role: 'non-resident parent',
              contact_info: {},
              indicators: [],
              relationship_to_primary_child: 'Non-Resident Parent'
            })
          }
        }
        
        // Add guardian if different from parent
        if (incident.guardian && incident.guardian !== `${incident.parent_first_names} ${incident.parent_last_names}`.trim()) {
          const guardianExists = allPersons.some(p => 
            `${p.first_name} ${p.last_name}`.trim() === incident.guardian
          )
          
          if (!guardianExists) {
            const guardianNames = incident.guardian.split(' ')
            const firstName = guardianNames[0] || ''
            const lastName = guardianNames.slice(1).join(' ') || ''
            
            if (firstName) {
              additionalPersons.push({
                person_id: `${incident.incident_number}-guardian`,
                first_name: firstName,
                last_name: lastName,
                date_of_birth: '',
                role: 'guardian',
                contact_info: {},
                indicators: [],
                relationship_to_primary_child: 'Guardian'
              })
            }
          }
        }
        
        // Additional relatives can be added manually via the UI
        
        allPersons = [...allPersons, ...additionalPersons]
      }
      
      setCasePersons(allPersons)
      
      // Initialize child details for all children/clients
      const initialChildDetails: ChildDetails = {}
      allPersons
        .filter(person => person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child')
        .forEach(child => {
          const details: ChildDetails[string] = {
            safeHaven: false,
            nativeAmericanHeritage: false,
            voluntaryPlacementAgreement: false,
            allergies: false,
            courtInvolved: false,
            infantAffectedBySubstances: false,
            sexTraffickingVictim: false
          }
          
          // Pre-populate from incident data if available
          if (incident && child.person_id === incident.person_id) {
            details.nativeAmericanHeritage = incident.reported_native_american_heritage === 'Yes'
            // Additional child details can be set manually via the UI
          }
          
          initialChildDetails[child.person_id] = details
        })
      
      setChildDetails(initialChildDetails)
      setError(null)
    }
  }, [isOpen, case_, incident])

  // Get case members (people with formal roles in the case)
  const getCaseMembers = () => {
    return casePersons.filter(person => 
      ['Client', 'Parent', 'Guardian', 'Caregiver', 'Alleged Perpetrator'].includes(person.role)
    )
  }

  // Get relatives/family supports (people with supportive roles)
  const getRelatives = () => {
    return casePersons.filter(person => 
      ['Relative', 'Family Friend', 'Support Person', 'Emergency Contact', 'Family Support'].includes(person.role)
    )
  }

  // Get children for child details section
  const getChildren = () => {
    return casePersons.filter(person => 
      person.role.toLowerCase() === 'client' || person.role.toLowerCase() === 'child'
    )
  }

  // Handle adding a person via search
  const handlePersonSearch = (type: 'case-members' | 'relatives') => {
    setSearchModalType(type)
    setShowPersonSearch(true)
  }

  // Handle person selection from search modal
  const handlePersonSelected = (person: Person) => {
    // Check if person is already in the case
    if (casePersons.some(p => p.person_id === person.person_id)) {
      setError('This person is already added to the case')
      return
    }

    // Add person with appropriate default role based on type
    const defaultRole = searchModalType === 'case-members' ? 'Parent' : 'Relative'
    const personWithRole: Person = {
      ...person,
      role: defaultRole.toLowerCase(),
      relationship_to_primary_child: defaultRole
    }

    setCasePersons([...casePersons, personWithRole])
    setShowPersonSearch(false)
    setError(null)
    
    // If this person was successfully added via API (when caseId is provided),
    // the modal will close automatically. The person should now appear in the list.
  }

  // Handle adding a person via form
  const handleAddPersonForm = (type: 'case-members' | 'relatives') => {
    setAddPersonType(type)
    setShowAddPersonForm(true)
    setNewPersonData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      role: type === 'case-members' ? 'Parent' : 'Relative'
    })
  }

  // Handle saving new person
  const handleSaveNewPerson = () => {
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

  // Handle canceling add person form
  const handleCancelAddPerson = () => {
    setShowAddPersonForm(false)
    setNewPersonData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      role: 'Parent'
    })
  }

  // Handle removing a person
  const handleRemovePerson = (personId: string) => {
    setCasePersons(casePersons.filter(p => p.person_id !== personId))
  }

  // Handle role change
  const handleRoleChange = (personId: string, newRole: string) => {
    setCasePersons(casePersons.map(person => 
      person.person_id === personId 
        ? { ...person, role: newRole.toLowerCase(), relationship_to_primary_child: newRole }
        : person
    ))
  }

  // Handle child detail changes
  const handleChildDetailChange = (childId: string, field: keyof ChildDetails[string], value: boolean) => {
    setChildDetails(prev => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [field]: value
      }
    }))
  }

  // Handle finish setup
  const handleFinishSetup = async () => {
    if (!case_) return

    setLoading(true)
    setError(null)

    try {
      // Update case with final data and change status to "Pending Assignment"
      const updates = {
        case_display_name: caseName,
        status: 'Pending Assignment'
      }

      const response = await updateCase(case_.case_id, updates)
      
      if (response.error) {
        setError(response.error)
      } else {
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

        <div className="modal-body" style={{ padding: 0 }}>
          {/* Tab Navigation */}
          <div className="tabs-container" style={{ margin: 0, borderRadius: 0 }}>
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'review-case' ? 'active' : ''}`}
                onClick={() => setActiveTab('review-case')}
              >
                <span className="icon">assignment</span>
                Review Case
              </button>
              <button
                className={`tab ${activeTab === 'review-living' ? 'active' : ''}`}
                onClick={() => setActiveTab('review-living')}
              >
                <span className="icon">home</span>
                Review Living Assignments
              </button>
            </div>
          </div>

          <div style={{ padding: 'var(--unit-6)' }}>
            {error && (
              <div className="error-message">
                <span className="icon">error</span>
                {error}
              </div>
            )}

            {/* Review Case Tab */}
            {activeTab === 'review-case' && (
              <div className="tab-content">
                {/* Case Name Section */}
                <div className="card" style={{ marginBottom: 'var(--unit-6)' }}>
                  <div className="card-header">
                    <h2>✏️ Name this case</h2>
                  </div>
                  <div className="card-content">
                    <div className="form-group">
                      <input
                        type="text"
                        value={caseName}
                        onChange={(e) => setCaseName(e.target.value)}
                        placeholder="Enter a descriptive name for this case..."
                        className="form-control"
                        style={{ fontSize: 'calc(var(--size) * 1)', padding: 'var(--unit-4)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Case Membership Section */}
                <div className="card" style={{ marginBottom: 'var(--unit-6)' }}>
                  <div className="card-header">
                    <h2>👥 Case Membership</h2>
                  </div>
                  <div className="card-content">
                    {/* Case Members Table */}
                    <div className="association-box">
                  <div className="box-header">
                    <h4>Case Members</h4>
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
                      <h5>Add New Person</h5>
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
                          <label>Role *</label>
                          <select
                            value={newPersonData.role}
                            onChange={(e) => setNewPersonData({...newPersonData, role: e.target.value as any})}
                          >
                            <option value="Parent">Parent</option>
                            <option value="Non-Resident Parent">Non-Resident Parent</option>
                            <option value="Client">Client</option>
                            <option value="Guardian">Guardian</option>
                          </select>
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
                            <th>Actions</th>
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
                                  {person.date_of_birth && (
                                    <div className="person-age">
                                      Age: {Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                                    </div>
                                  )}
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
                                </select>
                              </td>
                              <td>
                                <button 
                                  onClick={() => handleRemovePerson(person.person_id)}
                                  className="action-btn small error"
                                >
                                  <span className="icon">remove</span>
                                  Remove
                                </button>
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

                {/* Relatives/Family Supports Table */}
                <div className="association-box">
                  <div className="box-header">
                    <h4>Relatives/Family Supports</h4>
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
                      <h5>Add New Person</h5>
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
                          <label>Role *</label>
                          <select
                            value={newPersonData.role}
                            onChange={(e) => setNewPersonData({...newPersonData, role: e.target.value as any})}
                          >
                            <option value="Relative">Relative</option>
                            <option value="Family Support">Family Support</option>
                          </select>
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getRelatives().map((person) => (
                            <tr key={person.person_id}>
                              <td>
                                <div className="person-name">
                                  <strong>{person.first_name} {person.last_name}</strong>
                                  {person.date_of_birth && (
                                    <div className="person-age">
                                      Age: {Math.floor((new Date().getTime() - new Date(person.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                                    </div>
                                  )}
                                </div>
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
                                <button 
                                  onClick={() => handleRemovePerson(person.person_id)}
                                  className="action-btn small error"
                                >
                                  <span className="icon">remove</span>
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="empty-state">
                        <span className="icon">family_restroom</span>
                        <p>No relatives/family supports added yet</p>
                      </div>
                    )}
                  </div>
                    </div>

                    {/* Child Details Section */}
                    {getChildren().length > 0 && (
                <div className="child-details-section">
                  <div className="box-header">
                    <h4>👶 Child(ren) Details</h4>
                    <div className="header-actions">
                      <span className="section-description">Select applicable categories for each child in this case.</span>
                    </div>
                  </div>
                  
                  {getChildren().map((child) => (
                    <div key={child.person_id} className="child-detail-card">
                      <div className="child-header">
                        <div className="child-info">
                          <span className="icon child-icon">person</span>
                          <h4>{child.first_name} {child.last_name}</h4>
                          {child.date_of_birth && (
                            <span className="child-age">
                              Age: {Math.floor((new Date().getTime() - new Date(child.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="child-categories-grid">
                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.safeHaven || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'safeHaven', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">shield</span>
                              <span className="category-label">Safe Haven</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.nativeAmericanHeritage || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'nativeAmericanHeritage', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">diversity_3</span>
                              <span className="category-label">Native American Heritage/Tribal Affiliation</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.voluntaryPlacementAgreement || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'voluntaryPlacementAgreement', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">handshake</span>
                              <span className="category-label">Voluntary Placement Agreement</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.allergies || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'allergies', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">medical_services</span>
                              <span className="category-label">Allergies</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.courtInvolved || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'courtInvolved', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">gavel</span>
                              <span className="category-label">Court Involved</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.infantAffectedBySubstances || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'infantAffectedBySubstances', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">baby_changing_station</span>
                              <span className="category-label">Infant(s) Affected by Substances</span>
                            </div>
                          </label>
                        </div>

                        <div className="category-item">
                          <label className="category-checkbox">
                            <input
                              type="checkbox"
                              checked={childDetails[child.person_id]?.sexTraffickingVictim || false}
                              onChange={(e) => handleChildDetailChange(child.person_id, 'sexTraffickingVictim', e.target.checked)}
                            />
                            <div className="checkbox-content">
                              <span className="category-icon icon">warning</span>
                              <span className="category-label">Sex Trafficking Victim</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                  </div>
                </div>
              </div>
            )}

            {/* Review Living Assignments Tab */}
            {activeTab === 'review-living' && (
              <div className="tab-content">
                <LivingArrangementsTable case_={case_} />
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button onClick={onClose} className="action-btn secondary">
              Cancel
            </button>
            
            {activeTab === 'review-case' ? (
              <button 
                onClick={() => setActiveTab('review-living')} 
                className="action-btn primary"
                disabled={!caseName.trim()}
              >
                Next
                <span className="icon">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={handleFinishSetup} 
                className="action-btn primary"
                disabled={loading}
              >
                {loading ? 'Requesting Assignment...' : 'Request SWCM Assignment'}
                <span className="icon">assignment_ind</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Magic Search Modal */}
      <MagicSearchModal
        isOpen={showPersonSearch}
        onClose={() => setShowPersonSearch(false)}
        onSelectPerson={handlePersonSelected}
        caseId={case_?.case_id}
        defaultRole={searchModalType === 'case-members' ? 'Parent' : 'Relative'}
      />

    </div>
  )
}
